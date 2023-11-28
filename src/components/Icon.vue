<script>
import JavaScriptIcon from "./icons/Javascript.vue";
import Unity from "./icons/Unity.vue";
import HTMLIC from "./icons/HTML.vue";
import CSSIC from "./icons/CSS.vue";
import PJS from "./icons/p5.vue";
import CS from "./icons/CS.vue";
import Github from "./icons/Github.vue";
import GithubPage from "./icons/GithubPage.vue";
import VueIcon from "./icons/VUE.vue";
import PhpIcon from "./icons/PHP.vue";
import MySQLIcon from "./icons/MySQL.vue";
import ElasticSearch from "./icons/ElasticSearch.vue";
import PsIcon from "./icons/PsIcon.vue";
import AsepriteIcon from "./icons/asepriteIcon.vue";
import TailwindIcon from "./icons/tailwindIcon.vue";
import JetbrainsIcon from "./icons/jetbrains.vue";
import MoreIcon from "./icons/More.vue";
import Git from "./icons/Git.vue";
import Game from './icons/Game.vue';
import Node from "./icons/Node.vue";
import Linkedin from "./icons/linkedin.vue";

export default{
    components:{
    JavaScriptIcon,
    Unity,
    HTMLIC,
    CSSIC,
    PJS,
    CS,
    Github,
    GithubPage,
    VueIcon,
    PhpIcon,
    MySQLIcon,
    ElasticSearch,
    PsIcon,
    AsepriteIcon,
    TailwindIcon,
    JetbrainsIcon,
    MoreIcon,
    Git,
    Game,
    Node,
    Linkedin
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
<VueIcon v-if="this.icon === 'vue'"></VueIcon>
<PhpIcon v-if="this.icon === 'php'"></PhpIcon>
<MySQLIcon v-if="this.icon === 'mysql'"></MySQLIcon>
<ElasticSearch v-if="this.icon === 'elasticsearch'"></ElasticSearch>
<PsIcon v-if="this.icon === 'photoshop'"></PsIcon>
<AsepriteIcon v-if="this.icon === 'aseprite'"></AsepriteIcon>
<TailwindIcon v-if="this.icon === 'tailwind'"></TailwindIcon>
<JetbrainsIcon v-if="this.icon === 'jetbrains'"></JetbrainsIcon>
<MoreIcon v-if="this.icon === 'more'"></MoreIcon>
<Git v-if="this.icon === 'git'"></Git>
<Game v-if="this.icon === 'game'"></Game>
<Node v-if="this.icon === 'node'"></Node>
<Linkedin v-if="this.icon === 'linkedin'"></Linkedin>


</template>