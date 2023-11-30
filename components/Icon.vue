<script>
export default{
    props:[
        "icon"
    ]
}
</script>

<template>

<IconsJavascript v-if="this.icon === 'javascript'"></IconsJavascript>
<IconsUnity v-if="this.icon === 'unity'"></IconsUnity>
<IconsHTML v-if="this.icon === 'html'"></IconsHTML>
<IconsCSS v-if="this.icon === 'css'"></IconsCSS>
<IconsP5 v-if="this.icon === 'p5js'"></IconsP5>
<IconsCS v-if="this.icon === 'csharp'"></IconsCS>
<IconsGithub v-if="this.icon === 'github'"></IconsGithub>
<IconsGithubPage v-if="this.icon === 'githubPage'"></IconsGithubPage>
<IconsVUE v-if="this.icon === 'vue'"></IconsVUE>
<IconsPHP v-if="this.icon === 'php'"></IconsPHP>
<IconsMySQL v-if="this.icon === 'mysql'"></IconsMySQL>
<IconsElasticSearch v-if="this.icon === 'elasticsearch'"></IconsElasticSearch>
<IconsPsIcon v-if="this.icon === 'photoshop'"></IconsPsIcon>
<IconsAsepriteIcon v-if="this.icon === 'aseprite'"></IconsAsepriteIcon>
<IconsTailwindIcon v-if="this.icon === 'tailwind'"></IconsTailwindIcon>
<IconsJetbrains v-if="this.icon === 'jetbrains'"></IconsJetbrains>
<IconsMore v-if="this.icon === 'more'"></IconsMore>
<IconsGit v-if="this.icon === 'git'"></IconsGit>
<IconsGame v-if="this.icon === 'game'"></IconsGame>
<IconsNode v-if="this.icon === 'node'"></IconsNode>
<IconsLinkedin v-if="this.icon === 'linkedin'"></IconsLinkedin>
<IconsRuby v-if="this.icon === 'ruby'"></IconsRuby>
<IconsFirebase v-if="this.icon === 'firebase'"></IconsFirebase>
<IconsElectron v-if="this.icon === 'electron'"></IconsElectron>

</template>