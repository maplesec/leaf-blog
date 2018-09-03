<template>
    <div class="app-container calendar-list-container bg-grey">
        <header-part></header-part>
        <router-view></router-view>
        <footer-part></footer-part>
    </div>
</template>

<script>
    import headerPart from "./header.vue"
    import footerPart from "./footer.vue"
    export default {
        components: {
            headerPart,
            footerPart
        },
        data () {
            return {}
        }
    }
</script>