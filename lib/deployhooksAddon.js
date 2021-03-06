var _ = require('lodash');

module.exports = function (app) {
  return {
    configure: function (configAddons) {

      function deleteOldAddons() {
        return app.addons().listByApp().then(function (addons) {
          return addons.filter(function (addon) {
            return addon.addon_service.name === 'deployhooks';
          }).map(function (addon) {
            return addon.id;
          });
        }).then(function (ids) {
          return ids.map(function (id) {
            return app.addons(id).delete();
          });
        }).then(function (promises) {
          return Promise.all(promises);
        });
      }
      function createNewAddons() {
        if(!Array.isArray(configAddons)) {
          configAddons = [configAddons];
        }
        return Promise.all(configAddons.map(function(addon) {
          return app.addons().create(addon);
        }));
      }
      return deleteOldAddons().then(createNewAddons());
    }
  };
};
