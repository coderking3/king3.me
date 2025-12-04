import type { CollectionConfig } from 'payload'

export const Projects: CollectionConfig = {
  slug: 'projects',
  access: {
    read: () => true,
    create: () => true,
    update: () => true,
    delete: () => true
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true
    },
    {
      name: 'description',
      type: 'textarea',
      required: true
    },
    {
      name: 'techStack',
      type: 'array',
      required: true,
      fields: [
        {
          name: 'tech',
          type: 'text'
        }
      ]
    },
    {
      name: 'github',
      type: 'text',
      required: false
    },
    {
      name: 'image',
      type: 'text',
      required: false
    },
    {
      name: 'published',
      type: 'checkbox',
      required: false,
      defaultValue: false
    },
    {
      name: 'createdAt',
      type: 'date',
      required: true,
      defaultValue: () => new Date()
    },
    {
      name: 'updatedAt',
      type: 'date',
      required: true,
      defaultValue: () => new Date()
    }
  ],
  timestamps: true,
  hooks: {
    beforeChange: [
      async ({ data }) => {
        if (data) {
          data.updatedAt = new Date()
        }
        return data
      }
    ]
  }
}
