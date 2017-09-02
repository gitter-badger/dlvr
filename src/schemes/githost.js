exports.default = {
  properties: {
    provider: {
      required: true,
      type: 'string'
    },
    repo: {
      required: true,
      type: 'string'
    },
    release: {
      properties: {
        assets: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              file: {
                type: 'string',
                required: true
              },
              name: {
                type: 'string',
                required: true
              }
            }
          }
        },
        draft: {
          type: 'boolean'
        }
      },
      type: 'object',
      required: true
    }
  },
  type: 'object'
};
