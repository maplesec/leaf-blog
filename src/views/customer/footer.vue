<template>
    <footer id="footer" class="footer bg-white">
        <div class="footer-meta">
            <div class="footer-container">
                <div class="meta-item meta-copyright">
                    <div class="meta-copyright-info">
                        <a href="/" class="info-logo">
                            <img src="/static/logo/logo.jpg" alt="maple's blog">
                        </a>
                        <div class="info-text">
                            <p>Powered by <a href="https://github.com/maplesec/hsl" target="_blank" rel="nofollow">leaf-blog</a>
                            </p>
                            <p>&copy; 2018 <a href="https://github.com/maplesec">maplesec</a></p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </footer>
</template>

<script>
    export default {
        data () {
            return {}
        }
    }
</script>
<style>
    /*foot*/
    .footer {
        position: relative;
        z-index: 1;
        margin-top: 0;
        padding-bottom: 50px;
        background-color: #fff;
    }

    .footer-meta {
        padding: 50px 0 0;
        list-style: none;
    }

    .footer-meta .footer-container {
        width: 100%;
        max-width: 960px;
        /*height: 250px;*/
        margin: 0 auto;
        padding: 0 80px;
        text-align: center;
    }

    .footer-meta .meta-item {
        position: relative;
        /*width: 33.3333333%;*/
        min-height: 1px;
        padding: 0 30px;
        text-align: center;
    }

    .footer-meta .meta-copyright .info-logo img {
        height: 32px;
        margin-bottom: 12px;
        border-radius: 16px;
    }

    .info-text {
        font-size: 12px;
        color: #6f7180;
        text-decoration: none;
    }
</style>
