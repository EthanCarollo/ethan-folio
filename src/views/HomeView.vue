<script>
import ProjectsView from './ProjectsView.vue';
import TechnologiesView from './TechnologiesView.vue';
import SplashScreen from './home/SplashScreen.vue';
import ContactView from './ContactView.vue';

export default{
    components:{
    SplashScreen,
    ProjectsView,
    TechnologiesView,
    ContactView
}
}
</script>
<template>

    <SplashScreen></SplashScreen>
    <div id = "home" class ="w-screen h-screen relative z-0">
    </div>
    <ProjectsView></ProjectsView>
    <TechnologiesView></TechnologiesView>
    <ContactView></ContactView>
</template>