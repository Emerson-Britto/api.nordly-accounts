export { default as urlEncoding } from './urlEncoding';
export { default as formValidator } from './formValidator';

export const sleep = (fc:(s?:any) => void, time:number): Promise<void> => {
  return new Promise((resolve, reject) => {
    setTimeout(()=> {
      fc();
      resolve();
    }, time);
  })
};