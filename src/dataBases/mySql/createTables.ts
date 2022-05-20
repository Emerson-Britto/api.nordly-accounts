import * as models from '../../models';

(async() => {
  console.log('CREATING TABLE');
  for (let [modelName, modelRef] of Object.entries(models)) {
    await modelRef.sync({ force: false });
  }
})()
