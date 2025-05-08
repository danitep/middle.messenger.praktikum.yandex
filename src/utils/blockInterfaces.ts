import Block from "../framework/Block";

export interface PropsWithChildren{
  [key: string]: string|string[]|boolean|number|Props|Props[]|PropsWithChildren|PropsWithChildren[]|Block|Block[]|Events|RegExp,
}

//Здесь мешанина из классов потому что можно предать string, boolean и number
//при том ещё и Props для детей, а также PropsWithChildren для них же
//при том их может быть несколько
//Block и Block[] если мы передаём уже готовых детей
//+ Events
//RegExp - для паттернов для input'ов.

export interface Props{
  events?:Events;
  [key: string]: string|string[]|boolean|number|Props|Props[]|PropsWithChildren|PropsWithChildren[]|Block|Block[]|Function|undefined|RegExp,
}
//Здесь ко всему зоопарку добавляется функция и undefined, если ничего не передали (чтобы ts не орал).

export interface Events{
  [key: string]: ()=>{};
}

export interface Children{
  [key: string]: Block
}

export interface Lists{
  [key: string]: Block[]|string[]
}

