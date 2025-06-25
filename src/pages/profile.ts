import Block from '../framework/Block';
import { Props, PropsWithChildren } from '../utils/blockInterfaces';
import Slider from '../components/slider/slider';
import ProfilePopup from '../components/profilePopup/profilePopup';
import ProfileInfo from '../components/profileInfo/profileInfo';
import router, { Router } from '../components/router/router';
import authApi, { AuthAPI } from '../api/authApi';
import store, { Store } from '../utils/store';
import userApi, { UserAPI } from '../api/userApi';
import { Iargs } from '../utils/apiInterfaces';
import { checkIfLoggedOut, is401Error, is500Error } from '../utils/extraFunctions';

export default class Profile extends Block {
  router: Router;

  authApi: AuthAPI;

  userApi: UserAPI;

  store: Store;

  constructor(props:PropsWithChildren) {
    checkIfLoggedOut();
    console.log(props);
    super({
      ...props,

    });
    this.router = router;
    this.authApi = authApi;
    this.userApi = userApi;
    this.store = store;

    this.createNewProps(props);
  }

  openPopup(e:Event) {
    e.preventDefault();

    const newProps:PropsWithChildren = this.props as PropsWithChildren;
    (newProps.popup as PropsWithChildren).isOpened = true;
    this.createNewProps(newProps);
    this.render();
  }

  createChildren = (props: PropsWithChildren) => {
    const propsForInfo:PropsWithChildren = Object.keys(props).filter((key:string) => key !== 'popup').reduce((obj: PropsWithChildren, key:string) => {
      obj[key] = props[key];
      return obj;
    }, {});

    const slider = new Slider({
      linkpath: props.linkpath,
    });

    const params: PropsWithChildren = { params: props.popup };
    const profilePopup = new ProfilePopup(Object.assign(params, { loadAvatar: this.loadAvatar.bind(this) }));

    const profileInfo = new ProfileInfo({
      params: Object.assign(propsForInfo, { changeProfileData: this.changeProfileData.bind(this), changePassword: this.changePassword.bind(this) }),
      events: {
        click: (props.events as PropsWithChildren).click,
        click_image: this.openPopup.bind(this),
      },
    });

    return [slider, profilePopup, profileInfo];
  };

  loadAvatar(formData:FormData) {
    this.userApi.loadAvatar({ formData })
      .then((data:Iargs) => {
        this.store.setState('userInfo', data);

        this.createNewProps(this.props as PropsWithChildren);
        this.render();
      })
      .catch((err: Error) => {
        is500Error(err);
        is401Error(err);
        console.log(err);
      });
  }

  changeProfileData(data: Iargs) {
    this.userApi.changeProfileData(data)
      .then((data: unknown) => {
        this.store.setState('userInfo', data);

        this.createNewProps(this.props as PropsWithChildren);
        this.render();
      })
      .catch((err: Error) => {
        is500Error(err);
        is401Error(err);
        console.log(err);
      });
  }

  changePassword(data:Iargs) {
    this.userApi.changePassword(data)
      .then((data:unknown) => {
        console.log(data);
      })
      .catch((err: Error) => {
        is500Error(err);
        is401Error(err);
        console.log(err);
      });
  }

  createNewProps(props: PropsWithChildren) {
    const newProps = props;
    const storeInfo = this.store.getState();
    newProps.avatarTempPath = `https://ya-praktikum.tech/api/v2/resources/${storeInfo.userInfo.avatar}`;
    newProps.username = storeInfo.userInfo.first_name;
    (newProps.profileRowsData as Props[]).forEach((rowData: Props) => {
      if (rowData.name === 'display_name') {
        rowData.value = storeInfo.userInfo.first_name;
      } else {
        rowData.value = storeInfo.userInfo[rowData.name as string];
      }
    });

    const [slider, profilePopup, profileInfo] = this.createChildren(props);

    const additionalProps = {
      slider,
      profilePopup,
      profileInfo,
    };
    const propsWithEvents = Object.assign(newProps, additionalProps);
    this.setProps(propsWithEvents);
  }

  override render(): string {
    return `
        <div id="app">
            <main class="page__profile">
                {{{slider}}}
                {{{profileInfo}}}
                {{{profilePopup}}}
            </main>
        </div>
        `;
  }
}
