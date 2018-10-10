<template>
  <div class="main-content">
    <div>{{title}}</div>
    <div v-html="content" class="markdown-body"></div>
  </div>
</template>

<script>

import * as api from '@/services/draft'

export default {
  data () {
    return {

    }
  },
  computed: {
    title(){
        return this.$store.state.article.detail.title;
    },
    content(){
        return this.$store.state.article.detail.content;
    }
  },
  asyncData({store, route}){
    return store.dispatch('article/getArticle', route.params.id);
  },
  methods: {

  }
}
</script>
<style lang="scss">
  .markdown-body {
		box-sizing: border-box;
		min-width: 200px;
		max-width: 980px;
		margin: 0 auto;
		padding: 45px;
	}

	@media (max-width: 767px) {
		.markdown-body {
			padding: 15px;
		}
	}

  @import 'github-markdown-css'

</style>