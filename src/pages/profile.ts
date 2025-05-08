import Block from "../framework/Block";
import { PropsWithChildren } from "../utils/blockInterfaces";
import { Slider } from "../components/slider/slider";
import { ProfilePopup } from "../components/profilePopup/profilePopup";
import { ProfileInfo } from "../components/profileInfo/profileInfo";




export class Profile extends Block{
    constructor (props:PropsWithChildren){
        

        super({
            ...props,

        });
        const [slider, profilePopup, profileInfo] = this.createChildren(props)
        const newProps = props
        const additionalProps = {
            slider: slider,
            profilePopup: profilePopup,
            profileInfo: profileInfo,
        }
        const propsWithEvents = Object.assign(newProps, additionalProps)
        this.setProps(propsWithEvents);
    }

    openPopup(e:Event){
        e.preventDefault();
        let newProps:PropsWithChildren = this.props as PropsWithChildren;
        (newProps.popup as PropsWithChildren).isOpened = true;

        const [slider, profilePopup, profileInfo] = this.createChildren(newProps,);
        const additionalProps = {
            slider: slider,
            profilePopup: profilePopup,
            profileInfo: profileInfo
        }
        const events = {
            events:(this.props as PropsWithChildren).events
        }
        newProps = Object.assign(newProps, additionalProps, events);
        this.setProps(newProps);
        this.render();
    }

    createChildren = (props: PropsWithChildren) => {
        const propsForInfo:PropsWithChildren = Object.keys(props).filter((key:string) =>
            key !== 'popup').reduce((obj: PropsWithChildren, key:string) =>
            {
                obj[key] = props[key];
                return obj;
            }, {}
        );
    
        const slider = new Slider({
            linkpath: props.linkpath,
        })
    
        const profilePopup = new ProfilePopup({
            params: props.popup
        })
    
        const profileInfo = new ProfileInfo({
            params: propsForInfo,
            events:{
                'click': (props.events as PropsWithChildren).click,
                'click_image': this.openPopup.bind(this),
            }
        })
    
    
        return [slider, profilePopup, profileInfo];
    }

    override render(): string {
        return`
        <div id="app">
            <main class="page__profile">
                {{{slider}}}
                {{{profileInfo}}}
                {{{profilePopup}}}
            </main>
        </div>
        `
    }
}
