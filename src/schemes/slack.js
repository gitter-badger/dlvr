exports.default = {
  properties: {
    reportfail: {
      required: false,
      type: 'boolean'
    },
    channel: {
      required: true,
      type: 'string'
    },
    icon_emoji: {
      required: true,
      type: 'string'
    },
    username: {
      required: true,
      type: 'string'
    }
  },
  type: 'object'
};
