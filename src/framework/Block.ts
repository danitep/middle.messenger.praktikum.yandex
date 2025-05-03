import EventBus from './EventBus';
import HandleBars from 'handlebars';

import { PropsWithChildren, Props, Events, Children, Lists } from '../utils/blockInterfaces';



export default class Block {
    static EVENTS = {
      INIT: "init",
      FLOW_CDM: "flow:component-did-mount",
      FLOW_CDU: "flow:component-did-update",
      FLOW_RENDER: "flow:render"
    };
  
  _element:HTMLElement|null = null;
  _meta:{tagName: string} = {tagName:"div"};
  _id:number = Math.floor(100000 + Math.random()*900000);
  _setUpdate:boolean = false;
  props:Props;
  children:Children;
  lists:Lists;
  eventBus: () => EventBus;
  

  constructor(propsWithChildren:PropsWithChildren = {}) {
    const eventBus = new EventBus();
    const {props, children, lists} = this.__getChildrenPropsAndProps(propsWithChildren);
    this._meta = {tagName:"div"};
  
    this.props = this._makePropsProxy(props) as Props;
    this.children = this._makePropsProxy(children) as Children;
    this.lists = lists;
    this.eventBus = () => eventBus;
    this._registerEvents(eventBus);
    eventBus.emit(Block.EVENTS.INIT);
  }

  _addEvents(){
    const {events = {}} = this.props;
    Object.keys(events).forEach((eventName:string)=>{
      if(this._element){
        const links:NodeListOf<HTMLAnchorElement> = this._element.querySelectorAll('a');
        const forms:NodeListOf<HTMLFormElement>  = this._element.querySelectorAll('form');

        //click_image 
        //добавить на открытие попапа, там вроде button
        //лучше искать button внутри if click_image
        if(eventName === "click" && links.length>0){
          links.forEach((link)=>{
            if (link.href !== "" && link.href !== link.baseURI){
              link.addEventListener(eventName, events[eventName])
            }
          })
        }

        if(eventName === "click_button" && links.length>0){
          links.forEach((link)=>{
            if (link.pathname === "" || link.pathname === "/"){
              link.addEventListener('click', events[eventName])
            }
          })
        }

        if(eventName === "submit" && forms.length>0){
          forms.forEach((form)=>{
            form.addEventListener(eventName, events[eventName])
          })
        }
        
        if(eventName === "click_image"){
          const button = this._element.querySelector('button[type="button"]')
          if(button){
            button.addEventListener('click', events[eventName])
          }
        }
        
        if(eventName === "popup_close"){
          this._element.addEventListener('click', events[eventName])
        }

        if(eventName === "popup_submit"){
          forms.forEach((form)=>{
            form.addEventListener("submit", events[eventName])
          })
        }
        
        if(eventName === "change"){
          const inputs = this._element.querySelectorAll('input');
          inputs.forEach((input)=>{
            input.addEventListener(eventName, events[eventName])
          })
        }else{//затычка, если что-то забыл обработать (удалить в конце)
          const message: {[key: string]: () => {}} = {}
          message[eventName] =events[eventName]
          //console.log(message)
        }
      }
    })
  }
  
  _registerEvents = (eventBus:EventBus) => {
    eventBus.on(Block.EVENTS.INIT, this.init.bind(this));
    eventBus.on(Block.EVENTS.FLOW_CDM, this._componentDidMount.bind(this));
    eventBus.on(Block.EVENTS.FLOW_CDU, this._componentDidUpdate.bind(this));
    eventBus.on(Block.EVENTS.FLOW_RENDER, this._render.bind(this));
  }
  
  _createResources = ():void => {
    const { tagName } = this._meta;
    this._element = this._createDocumentElement(tagName);
  }
  
  init = ():void => {
    this._createResources();
  
    this.eventBus().emit(Block.EVENTS.FLOW_RENDER);
  }
  
  _componentDidMount() {
    this.componentDidMount();
    Object.values(this.children).forEach(child =>{this.dispatchComponentDidMount();})
  }
  
  componentDidMount = ():void => {}
  
  dispatchComponentDidMount = ():void => {
    this.eventBus().emit(Block.EVENTS.FLOW_CDM);
  }
  
  _componentDidUpdate  = (oldProps:Props, newProps:Props):void => {
    const response = this.componentDidUpdate(oldProps, newProps);
    if (!response) {
      return;
    }
    this._render();
  }
  
  componentDidUpdate = (oldProps:Props, newProps:Props):Boolean => {
    return true;
  }

  __getChildrenPropsAndProps(propsWithChildren:PropsWithChildren){
    const props:Props|PropsWithChildren = {}
    const children:Children = {};
    const lists:Lists = {};
    Object.entries(propsWithChildren).forEach(([key, value])=>{
      if (value instanceof Block){
        children[key] = value;
      } else if(value && Array.isArray(value) && (value[0] instanceof Block)){
        lists[key] = value as Block[];
      } else{
        props[key] = value;
      }
    });
    return {children, props, lists}
  }

  addAttributes() {
    const {attr = {}} = this.props;

    Object.entries(attr).forEach(([key, value])=>{
      this._element?.setAttribute(key,value);
    })
  }
  
  setProps = (newProps:PropsWithChildren) => {
    if (!newProps) {
      return;
    }
    this._setUpdate = true;
    const oldTarget = {...this.props};

    const {props, children, lists} = this.__getChildrenPropsAndProps(newProps);
    
    if(Object.values(children).length)
      Object.assign(this.children, children);
    if(Object.values(lists).length)
      Object.assign(this.lists, lists);
    if(Object.values(props).length)
      Object.assign(this.props, props);

    if (this._setUpdate){
      this._setUpdate = false;
      this.eventBus().emit(Block.EVENTS.FLOW_CDU, oldTarget, this.props);
    }
  };
  
  get element() {
    return this._element;
  }
  
  _render() {
    const propsAndStubs = {...this.props};
    const _tmpId:string = `${Math.floor(100000 + Math.random()*900000)}`;
    Object.entries(this.children).forEach(([key,child])=>{
      propsAndStubs[key] = `<div data-id="${child._id}"></div>`;
    });

    Object.entries(this.lists).forEach(([key, list])=>{
      propsAndStubs[key] = `<div data-id="__l_${_tmpId+key}"></div>`
    });
    
    const fragment:HTMLTemplateElement = this._createDocumentElement('template') as HTMLTemplateElement;
    fragment.innerHTML = HandleBars.compile(this.render())(propsAndStubs);

    Object.values(this.children).forEach(child =>{
      const stub = fragment.content.querySelector(`[data-id="${child._id}"]`)
      if (stub){
        stub.replaceWith(child.getContent() as Node);
      }
    })

    Object.entries(this.lists).forEach(([key, list])=>{
      const listCont = this._createDocumentElement('template') as HTMLTemplateElement;
      list.forEach(item =>{
        if (item instanceof Block){
          listCont.content.append(item.getContent() as Node)
        } else{
          listCont.content.append(`${item}`);
        }
      });
      const stub = fragment.content.querySelector(`[data-id="__l_${_tmpId+key}"]`);
      
      if (stub){
        stub.replaceWith(listCont.content);
      }
      
    });

    const newElement:Element|null = fragment.content.firstElementChild;
    if (this._element && newElement){
      this._element.replaceWith(newElement);
    }
    this._element = newElement as HTMLElement;
    this._addEvents();
    this.addAttributes();
  }
  
  render() {}
  
  getContent():HTMLElement|null {
    return this._element;
  }
  
  _makePropsProxy(props:Props|Children) {
    const self = this;
    return new Proxy(props, {
      get(target:Props, prop:string) {
        const value:string|string[]|boolean|number|Props|Props[]|PropsWithChildren|PropsWithChildren[]|Block|Block[]|Function|undefined = target[prop];
        //Здесь не нашёл способа воткнуть одну формулировку, вместо вставки всего того что входит в Props,
        //Если короче, не вышло сделать PropsWithoutEvents
        return typeof value === "function" ? value.bind(target) : value;
      },
      set(target:Props, prop:string, value:string|Props|Events|Function|undefined) {
        if (target[prop] !== value){
          target[prop] = value;
          self._setUpdate = true;
        }
        return true;
      },
      deleteProperty() {
        throw new Error("Нет доступа");
      }
    });
  }
  
  _createDocumentElement(tagName:string):HTMLElement|HTMLTemplateElement {
    if(tagName==='template'){
      return document.createElement(tagName) as HTMLTemplateElement
    }
    return document.createElement(tagName)
  }
  
  show() {
    const element = this.getContent();
    if(element)
      element.style.display = "block";
  }
  
  hide() {
    const element = this.getContent();
    if(element)
      element.style.display = "none";
  }
  }