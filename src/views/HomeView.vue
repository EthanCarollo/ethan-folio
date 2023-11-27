<script>
import ProjectsView from './ProjectsView.vue';
import SplashScreen from './home/SplashScreen.vue';

export default{
    components:{
    SplashScreen,
    ProjectsView
}
}
</script>
<template>

    <SplashScreen></SplashScreen>
    <div class ="w-screen h-screen relative z-0">
    </div>
    <ProjectsView></ProjectsView>
</template>