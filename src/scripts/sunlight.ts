const canvas = document.querySelector<HTMLCanvasElement>('.sunlight-canvas');

if (canvas) {
  const gl = canvas.getContext('webgl', { alpha: true, antialias: false, depth: false, premultipliedAlpha: false });
  if (gl) {
    const vertex = `attribute vec2 position;
      void main() { gl_Position = vec4(position, 0., 1.); }`;
    const fragment = `precision mediump float;
      uniform vec2 resolution;
      uniform float time;
      float band(float p, float center, float width) {
        return 1. - smoothstep(width, width + .024, abs(p - center));
      }
      void main() {
        vec2 uv = gl_FragCoord.xy / resolution;
        vec2 p = vec2((uv.x - .67) * resolution.x / resolution.y, 1. - uv.y);
        float drift = sin(time * .065) * .012;
        float ripple = sin(p.y * 8. + time * .12) * .006 + sin(p.x * 11. - time * .09) * .004;
        vec2 q = mat2(.86, -.5, .5, .86) * p;
        q.x += drift + ripple;
        q.y += sin(time * .045) * .009;
        float envelope = exp(-dot(p * vec2(1.2, 1.05), p * vec2(1.2, 1.05)) * 3.);
        float frame = max(band(q.x, .13, .008), max(band(q.y, .27, .009), band(q.y, .62, .009)));
        float cloud = .86 + .14 * sin(time * .075 + p.x * 3. + p.y * 2.);
        vec3 color = mix(vec3(1., .78, .36), vec3(.36, .34, .27), frame);
        float alpha = envelope * cloud * mix(.085, .075, frame);
        gl_FragColor = vec4(color, alpha);
      }`;
    const shaders: WebGLShader[] = [];
    const compile = (type: number, source: string) => {
      const shader = gl.createShader(type);
      if (!shader) return null;
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) { gl.deleteShader(shader); return null; }
      shaders.push(shader);
      return shader;
    };
    const vs = compile(gl.VERTEX_SHADER, vertex);
    const fs = compile(gl.FRAGMENT_SHADER, fragment);
    const program = gl.createProgram();
    if (vs && fs && program) {
      gl.attachShader(program, vs);
      gl.attachShader(program, fs);
      gl.linkProgram(program);
      if (gl.getProgramParameter(program, gl.LINK_STATUS)) {
        gl.useProgram(program);
        const buffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]), gl.STATIC_DRAW);
        const position = gl.getAttribLocation(program, 'position');
        gl.enableVertexAttribArray(position);
        gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);
        const resolution = gl.getUniformLocation(program, 'resolution');
        const time = gl.getUniformLocation(program, 'time');
        const reduced = matchMedia('(prefers-reduced-motion: reduce)');
        let frame = 0;
        let visible = true;
        let lost = false;
        let elapsed = 0;
        let previous = 0;
        const draw = () => {
          gl.uniform2f(resolution, canvas.width, canvas.height);
          gl.uniform1f(time, elapsed);
          gl.drawArrays(gl.TRIANGLES, 0, 6);
        };
        const tick = (now: number) => {
          if (previous) elapsed += Math.min((now - previous) / 1000, .05);
          previous = now;
          draw();
          frame = requestAnimationFrame(tick);
        };
        const sync = () => {
          cancelAnimationFrame(frame);
          previous = 0;
          if (lost) return;
          draw();
          if (visible && !document.hidden && !reduced.matches) frame = requestAnimationFrame(tick);
        };
        const resize = new ResizeObserver(() => {
          // Soft light needs no high-density rendering; cap the full-page texture cost.
          const scale = Math.min(1, 1600 / canvas.clientHeight, 1600 / canvas.clientWidth);
          canvas.width = Math.max(1, Math.round(canvas.clientWidth * scale));
          canvas.height = Math.max(1, Math.round(canvas.clientHeight * scale));
          gl.viewport(0, 0, canvas.width, canvas.height);
          sync();
        });
        resize.observe(canvas);
        const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; sync(); });
        observer.observe(canvas);
        reduced.addEventListener('change', sync);
        document.addEventListener('visibilitychange', sync);
        canvas.addEventListener('webglcontextlost', () => { lost = true; cancelAnimationFrame(frame); });
        window.addEventListener('pagehide', (event) => {
          cancelAnimationFrame(frame);
          if (event.persisted) return;
          resize.disconnect(); observer.disconnect();
          reduced.removeEventListener('change', sync);
          document.removeEventListener('visibilitychange', sync);
          gl.deleteBuffer(buffer); gl.deleteProgram(program);
          shaders.forEach(shader => gl.deleteShader(shader));
        });
        window.addEventListener('pageshow', sync);
      }
    }
  }
}
