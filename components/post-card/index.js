const api = require('../../api/interaction')
Component({
  properties: {
    post: Object
  },
  data: {
    busy: false
  },
  methods: {
    open() {
      this.triggerEvent('open', {
        id: this.data.post.id
      })
    },
    async like() {
      if (this.data.busy) return;
      this.setData({
        busy: true
      });
      try {
        const p = this.data.post;
        const result = await (p.liked ? api.unlike : api.like)({
          postId: p.id
        });
        this.setData({
          post: result
        })
        this.triggerEvent('change', { post: result })
      } catch (e) {
        require('../../utils/ui').error(e)
      } finally {
        this.setData({
          busy: false
        })
      }
    }
  }
})
