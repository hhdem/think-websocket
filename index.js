const helper = require('think-helper');
const assert = require('assert');
const deprecate = require('depd')('think-websocket');

module.exports = app => {
  let instance;
  app.on('appReady', () => {
    const config = helper.parseAdapterConfig(app.think.config('websocket'));
    const Handle = config.handle;
    assert(helper.isFunction(Handle), 'websocket.handle must be a function');
    instance = new Handle(app.server, config, app);
    instance.run();
    app.websocket = instance;
  });

  return {
    context: {
      /**
       * get socket data
       */
      get data() {
        deprecate('ctx.data is deprecated, use ctx.wsData instead');
        return this.req.websocketData;
      },
      /**
       * get socket data
       */
      get wsData() {
        return this.req.websocketData;
      },
      /**
       * get wsCallback
       */
      get wsCallback() {
        return this.req.wsCallback;
      },
      /**
       * get socket
       */
      get websocket() {
        return this.req.websocket;
      },
      /**
       * is websocket request
       */
      get isWebsocket() {
        return this.isMethod('WEBSOCKET');
      },
      /**
       * emit an event
       * @param {String} event
       * @param {Mixed} data
       */
      emit(event, data) {
        this.res.statusCode = 200;
        instance.emit(event, data, this.req.websocket);
      },
      /**
       * broadcast event
       * @param {String} event
       * @param {Mixed} data
       */
      broadcast(event, data) {
        this.res.statusCode = 200;
        instance.broadcast(event, data, this.req.websocket);
      },

        /**
         *
         * @param event
         * @param data
         */
      toroom(room, event, data) {
          this.res.statusCode = 200;
          instance.toroom(room, event, data, this.req.websocket);
      },

      joinroom(room, event, data) {
          this.res.statusCode = 200;
          instance.joinroom(room, event, data, this.req.websocket);
      }
    },
    controller: {
      get data() {
        deprecate('controller.data is deprecated, use controller.wsData instead');
        return this.ctx.data;
      },
      get wsData() {
        return this.ctx.wsData;
      },
      get wsCallback() {
        return this.ctx.wsCallback;
      },
      get websocket() {
        return this.ctx.websocket;
      },
      get isWebsocket() {
        return this.ctx.isWebsocket;
      },
      emit(event, data) {
        return this.ctx.emit(event, data);
      },
      broadcast(event, data) {
        return this.ctx.broadcast(event, data);
      },
      toroom(room, event, data) {
          return this.ctx.toroom(room, event, data);
      },
      joinroom(room, event, data) {
          return this.ctx.joinroom(room, event, data);
      }
    }
  };
};
