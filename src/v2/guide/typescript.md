---
title: Soporte TypeScript
type: guide
order: 404
---


> En Vue 2.5.0+, hemos mejorado enormemente nuestras declaraciones de tipo para trabajar con la API predeterminada basada en objetos. Al mismo tiempo, introduce algunos cambios que requieren acciones de actualización. Lea [esta publicación del blog](https://medium.com/the-vue-point/upcoming-typescript-changes-in-vue-2-5-e9bd7e2ecf08) para más detalles.

## Delaracion Oficial en Packetes NPM 

Un sistema de tipo estático puede ayudar a prevenir muchos errores potenciales en el tiempo de ejecución, especialmente a medida que las aplicaciones crecen. Es por eso que Vue se envía con [declaraciones oficiales de tipo](https://github.com/vuejs/vue/tree/dev/types) para [TypeScript](https://www.typescriptlang.org/) - no solo en Vue Core, sino también para [vue-router](https://github.com/vuejs/vue-router/tree/dev/types) y [vuex](https://github.com/vuejs/vuex/tree/dev/types).

Ya que estos se [publican en NPM](https://cdn.jsdelivr.net/npm/vue/types/), y el último TypeScript sabe cómo resolver las declaraciones de tipo en los paquetes de NPM, esto significa que cuando se instala a través de NPM, no necesita herramientas adicionales para usar TypeScript con Vue.

## Configuracon recomendada

``` js
// tsconfig.json
{
  "compilerOptions": {    
    // esto se alinea con el soporte del navegador de Vue    
    "target": "es5",
    // esto permite una inferencia más estricta para las propiedades de datos en `this`    
    "strict": true,
    // si usa webpack 2+ o rollup, para aprovechar la agitación del árbol:
    "module": "es2015",
    "moduleResolution": "node"
  }
}
```

Tenga en cuenta que debe incluir `strict: true` (o, al menos, no `ImplicitThis: true`, que es parte de la marca `strict`) para aprovechar la verificación de tipos de `this` en los métodos de los componentes, de lo contrario, siempre se tratará como `cualquier` tipo.

Ver [documentos de opciones del compilador de TypeScript](https://www.typescriptlang.org/docs/handbook/compiler-options.html) para más detalles.

## Herramientas de desarrollo

### Creacion de Proyecto

[Vue CLI 3](https://github.com/vuejs/vue-cli) puede generar nuevos proyectos que utilizan TypeScript. Para empezar:

```bash
# 1. Instale Vue CLI, si aún no está instalado
npm install --global @vue/cli

# 2. Cree un nuevo proyecto, luego elija la opción "Seleccionar características manualmente"
vue create my-project-name
```

### Soporte para Editor

Para desarrollar aplicaciones de Vue con TypeScript, recomendamos encarecidamente el uso de [Visual Studio Code](https://code.visualstudio.com/), que proporciona una gran compatibilidad inmediata con TypeScript. Si está utilizando [components de un archivos](./single-file-components.html) (SFC) obtgenga las impresionantes [extension Vetur](https://github.com/vuejs/vetur) que proporciona inferencia de TypeScript dentro de SFC y muchas otras características excelentes.

[WebStorm](https://www.jetbrains.com/webstorm/) también ofrece compatibilidad inmediata con TypeScript y Vue.

## Uso Basico

Para permitir que TypeScript infiera correctamente los tipos dentro de las opciones de componentes de Vue, debe definir los componentes con `Vue.component` o `Vue.extend`:

``` ts
import Vue from 'vue'

const Component = Vue.extend({
  // tipo inferencia habilitada  
})

const Component = {
  // esto NO tendrá inferencia de tipo,  
  // porque TypeScript no puede decir que esto es opcion para un componente de Vue.  
}
```

## Componentes Vue Class-Style

Si prefiere una API basada en clase al declarar componentes, puede usar el decorador de [componente de clase vue](https://github.com/vuejs/vue-class-component) mantenido oficialmente:

``` ts
import Vue from 'vue'
import Component from 'vue-class-component'

// El decorador @Component indica que la clase es un componente Vue
@Component({
  // Todas las opciones de componentes están permitidas aquí
  template: '<button @click="onClick">Click!</button>'
})
export default class MyComponent extends Vue {
  // Los datos iniciales pueden ser declarados como propiedades de instancia  
  message: string = 'Hola!'

  // Los métodos de componente se pueden declarar como métodos de instancia
  onClick (): void {
    window.alert(this.message)
  }
}
```

## Augmentando los Tipos para Usar con  Plugins

Los Plugins pueden agregarse a las propiedades de instancia/global de Vue y las opciones de componentes En estos casos, se necesitan declaraciones de tipo para hacer que los complementos se compilen en TypeScript. Afortunadamente, hay una característica de TypeScript para aumentar los tipos existentes llamados [aumento de módulo](https://www.typescriptlang.org/docs/handbook/declaration-merging.html#module-augmentation).

Por ejemplo, para declarar una propiedad de instancia `$myProperty` de tipo `string`:

``` ts
// 1. Asegúrese de importar 'vue' antes de declarar los tipos aumentados
import Vue from 'vue'

// 2. Especifique un archivo con los tipos que desea aumentar
//    Vue tiene el tipo de constructor en types / vue.d.ts
declare module 'vue/types/vue' {
// 3. Declare augmentacion para Vue
  interface Vue {
    $myProperty: string
  }
}
```

Después de incluir el código anterior como un archivo de declaración (como `my-property.d.ts`) en su proyecto,puede usar `$myProperty` en una instancia de Vue.

```ts
var vm = new Vue()
console.log(vm.$myProperty) // This should compile successfully
```

También puede declarar propiedades globales adicionales y opciones de componentes:

```ts
import Vue from 'vue'

declare module 'vue/types/vue' {
  // Las propiedades globales pueden ser declaradas
  // en la interfaz `VueConstructor`
  interface VueConstructor {
    $myGlobal: string
  }
}

// ComponentOptions se declara en types / options.d.ts
declare module 'vue/types/options' {
  interface ComponentOptions<V extends Vue> {
    myOption?: string
  }
}
```

Las declaraciones anteriores permiten compilar el siguiente código:

```ts
// Propiedad Global 
console.log(Vue.$myGlobal)

// Opción componente adicional
var vm = new Vue({
  myOption: 'Hello'
})
```

## Anotando tipos de devoluciones

Debido a la naturaleza circular de los archivos de declaración de Vue, TypeScript puede tener dificultades para inferir los tipos de ciertos métodos. Por este motivo, es posible que tenga que anotar el tipo de retorno en métodos como `render` y aquellos en `computed`.

```ts
import Vue, { VNode } from 'vue'

const Component = Vue.extend({
  data () {
    return {
      msg: 'Hello'
    }
  },
  methods: {
    // necesita anotación debido a `this` en el tipo de retorno    
    greet (): string {
      return this.msg + ' world'
    }
  },
  computed: {
    // need annotation
    greeting(): string {
      return this.greet() + '!'
    }
  },
  // `createElement` se deduce, pero `render` necesita un tipo de retorno  
  render (createElement): VNode {
    return createElement('div', this.greeting)
  }
})
```

Si encuentra que la inferencia de tipos o la finalización de miembros no funciona, la anotación de ciertos métodos puede ayudar a resolver estos problemas. El uso de la opción `--noImplicitAny` ayudará a encontrar muchos de estos métodos sin anotar.