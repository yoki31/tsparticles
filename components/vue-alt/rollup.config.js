import vue from 'rollup-plugin-vue';
import typescript from 'rollup-plugin-typescript';
import { terser } from 'rollup-plugin-terser';

export default [ {
    input: 'src/Particles/index.ts',
    output: {
        format: 'esm',
        file: 'dist/vue2-particles.js',
    },
    external: [ 'vue', 'vue-property-decorator', 'tsparticles' ],
    plugins: [
        typescript({
            //tsconfig: true//,
            // experimentalDecorators: true,
            // module: 'es2015'
        }),
        vue()
    ]
},
    {
        input: 'src/Particles/index.ts',
        output: {
            format: 'esm',
            file: 'dist/vue2-particles.min.js'
        },
        external: [ 'vue', 'vue-property-decorator', 'tsparticles' ],
        plugins: [
            typescript({
                //tsconfig: true//,
                // experimentalDecorators: true,
                // module: 'es2015'
            }),
            vue(),
            terser()
        ]
    } ];
