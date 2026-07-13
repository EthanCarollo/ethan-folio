<template>
  <div ref="sketchContainer" class="ascii-wave-container w-full h-full select-none pointer-events-none"></div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'

const sketchContainer = ref(null)
let myP5 = null
let resizeObserver = null

const handleScroll = () => {
  if (!myP5) return
  const scrollY = window.scrollY
  const vh = window.innerHeight
  if (scrollY > vh) {
    myP5.noLoop()
  } else {
    if (!myP5.isLooping()) {
      // Resize canvas to current container dimensions before resuming
      resizeCanvasToContainer()
      myP5.loop()
    }
  }
}

const resizeCanvasToContainer = () => {
  if (!myP5 || !sketchContainer.value) return
  const container = sketchContainer.value
  const w = container.clientWidth
  const h = container.clientHeight
  if (w > 0 && h > 0) {
    myP5.resizeCanvas(w, h)
  }
}

onMounted(async () => {
  const p5 = (await import('p5')).default
  window.p5 = p5

  const sketch = (p) => {
    let asciiShader
    let fontTexture
    const density = " _.,-=+:;cba!?0123456789$W#@Ñ"

    const vert = `
      precision highp float;
      attribute vec3 aPosition;
      attribute vec2 aTexCoord;
      varying vec2 vTexCoord;
      void main() {
        vTexCoord = aTexCoord;
        vec4 positionVec4 = vec4(aPosition, 1.0);
        positionVec4.xy = positionVec4.xy * 2.0 - 1.0;
        gl_Position = positionVec4;
      }
    `

    const frag = `
      precision highp float;
      varying vec2 vTexCoord;
      uniform float u_time;
      uniform vec2 u_resolution;
      uniform float u_cols;
      uniform float u_rows;
      uniform sampler2D u_fontTex;
      uniform float u_densityLen;

      vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
      vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
      vec3 permute(vec3 x) { return mod289(((x*34.0)+1.0)*x); }

      float snoise(vec2 v) {
        const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
        vec2 i  = floor(v + dot(v, C.yy) );
        vec2 x0 = v -   i + dot(i, C.xx);
        vec2 i1;
        i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
        vec4 x12 = x0.xyxy + C.xxzz;
        x12.xy -= i1;
        i = mod289(i);
        vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 )) + i.x + vec3(0.0, i1.x, 1.0 ));
        vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
        m = m*m ; m = m*m ;
        vec3 x = 2.0 * fract(p * C.www) - 1.0;
        vec3 h = abs(x) - 0.5;
        vec3 ox = floor(x + 0.5);
        vec3 a0 = x - ox;
        m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );
        vec3 g;
        g.x  = a0.x  * x0.x  + h.x  * x0.y;
        g.yz = a0.yz * x12.xz + h.yz * x12.yw;
        return 130.0 * dot(m, g);
      }

      void main() {
        vec2 st = vTexCoord;
        float xIdx = floor(st.x * u_cols);
        float yIdx = floor(st.y * u_rows);
        vec2 gridUV = fract(vec2(st.x * u_cols, st.y * u_rows));

        vec2 center = vec2(0.5, 0.5);
        vec2 pos = vec2(xIdx / u_cols, yIdx / u_rows);
        float dist = distance(pos, center);
        float angle = atan(pos.y - center.y, pos.x - center.x);

        float n = snoise(vec2(dist * 2.5 - u_time * 0.15, angle * 1.5 + u_time * 0.1));
        n = clamp(n * 0.5 + 0.5, 0.0, 0.99);

        float charIdx = floor(n * u_densityLen);
        float atlasX = (charIdx + gridUV.x) / u_densityLen;
        vec2 atlasUV = vec2(atlasX, gridUV.y);

        vec4 textColor = texture2D(u_fontTex, atlasUV);
        gl_FragColor = vec4(textColor.rgb, textColor.a);
      }
    `

    const createFontTexture = () => {
      const fontSize = 64
      const pg = p.createGraphics(fontSize * density.length, fontSize)
      pg.clear()
      pg.fill(255)
      pg.textFont('monospace')
      pg.textSize(fontSize)
      pg.textAlign(p.CENTER, p.CENTER)

      for (let i = 0; i < density.length; i++) {
        pg.text(density[i], i * fontSize + fontSize / 2, fontSize / 2)
      }
      return pg
    }

    p.setup = () => {
      const container = sketchContainer.value
      if (!container) return
      p.pixelDensity(1)
      p.createCanvas(container.clientWidth, container.clientHeight, p.WEBGL)
      asciiShader = p.createShader(vert, frag)
      fontTexture = createFontTexture()
      p.noStroke()
    }

    p.draw = () => {
      if (!asciiShader) return
      p.background(0)
      p.shader(asciiShader)

      const scl = 18
      const cols = p.width / scl
      const rows = p.height / scl

      asciiShader.setUniform('u_time', p.frameCount * 0.05)
      asciiShader.setUniform('u_resolution', [p.width, p.height])
      asciiShader.setUniform('u_cols', cols)
      asciiShader.setUniform('u_rows', rows)
      asciiShader.setUniform('u_fontTex', fontTexture)
      asciiShader.setUniform('u_densityLen', Number(density.length))

      p.rect(0, 0, p.width, p.height)
    }
  }

  myP5 = new p5(sketch, sketchContainer.value)

  // Use ResizeObserver for reliable resize detection regardless of scroll state
  if (sketchContainer.value) {
    resizeObserver = new ResizeObserver(() => {
      resizeCanvasToContainer()
    })
    resizeObserver.observe(sketchContainer.value)
  }

  window.addEventListener('scroll', handleScroll, { passive: true })
})

onBeforeUnmount(() => {
  window.removeEventListener('scroll', handleScroll)
  if (resizeObserver) {
    resizeObserver.disconnect()
    resizeObserver = null
  }
  if (myP5) myP5.remove()
})
</script>

<style scoped>
.ascii-wave-container {
  overflow: hidden;
  background: black;
}
</style>
