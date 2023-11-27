<script>
import JavaScriptIcon from "./icons/Javascript.vue";
import Unity from "./icons/Unity.vue";
import HTMLIC from "./icons/HTML.vue";
import CSSIC from "./icons/CSS.vue";
import PJS from "./icons/p5.vue";
import CS from "./icons/CS.vue";
import Github from "./icons/Github.vue";
import GithubPage from "./icons/GithubPage.vue";
export default{
    components:{
    JavaScriptIcon,
    Unity,
    HTMLIC,
    CSSIC,
    PJS,
    CS,
    Github,
    GithubPage
},
    props:[
        "icon"
    ]
}
</script>

<template>

<JavaScriptIcon v-if="this.icon === 'javascript'"></JavaScriptIcon>
<Unity v-if="this.icon === 'unity'"></Unity>
<HTMLIC v-if="this.icon === 'html'"></HTMLIC>
<CSSIC v-if="this.icon === 'css'"></CSSIC>
<PJS v-if="this.icon === 'p5js'"></PJS>
<CS v-if="this.icon === 'csharp'"></CS>
<Github v-if="this.icon === 'github'"></Github>
<GithubPage v-if="this.icon === 'githubPage'"></GithubPage>


</template>