<script>
import Letterize from "letterizejs"
import anime from 'animejs/lib/anime.es.js';

export default{
    mounted(){
        this.animateEthewText()
    },
    methods: {
        animateEthewText: () => {
            const textEthew = new Letterize({
                targets: ".ethew-animated-text"
            });

            const animation = anime.timeline({
                targets: textEthew.listAll,
                delay: anime.stagger(100, {
                    grid: [textEthew.list[0].length, textEthew.list.length],
                    from: "center"
                }),
                loopBegin: (anim) => {
                    anime({
                    targets: '.ethew-animated-text',
                    lineHeight: 50,
                    easing: 'easeInOutQuad',
                    loopComplete: (anim)=>{
                        anime({
                        targets: '.ethew-animated-text',
                        lineHeight: 0,
                        easing: 'easeInOutQuad',
                        delay: 700,
                        loopComplete: (anim) => {
                                anime({
                                    targets:"#other-text-splash",
                                    opacity:"100%"
                                })
                            }
                        });
                    }
                    });
                }
                });

            

                animation
                    .add({
                        scale: 0.5,
                        skew: "20deg"
                    })
                    .add({
                        letterSpacing: "-15px",
                        skew: "0deg",
                        scale: 1,
                    })
            
        }
    }
}
</script>

<template>

    <div id="main-screen-text" class= "splash-screen absolute w-screen h-screen top-0 left-0 z-50 flex flex-col items-center justify-center">
        <div class ="flex flex-col items-center justify-center">
            <h1 class = "text-9xl text-orange-500 ethew-animated-text">ETHAN</h1>
            <h1 class = "text-9xl text-purple-500 ethew-animated-text">ETHAN</h1>
            <h1 class = "text-9xl text-green-500 ethew-animated-text">ETHAN</h1>
            <h1 class = "text-9xl text-red-500 ethew-animated-text">ETHAN</h1>
            <h1 class = "text-9xl text-white ethew-animated-text">ETHAN</h1>
        </div>
        <div id="other-text-splash" class ="mt-20 text-white opacity-0">
            <h1 class ="text-2xl">developpeur web</h1>
        </div>
    </div>

</template>

<style scoped>
.ethew-animated-text{
    font-family: "medium-unique";
    font-weight: 400;
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    text-transform: uppercase;
    letter-spacing: 6px;
    margin: 0;
    line-height: 0.8;
  }
  
#main-screen-text{
    font-family: LiveMono;
}

</style>