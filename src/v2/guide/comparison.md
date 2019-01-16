---
title: Comparación con otros frameworks
type: guide
order: 801
---

Esta es definitivamente la página más difícil de escribir en la guía, pero creemos que es importante. Lo más probable es que haya tenido problemas que intentó resolver y haya usado otra librería para ello. Está aquí porque quiere saber si Vue puede resolver mejor sus problemas específicos. Eso es lo que esperamos responder por usted.


También nos esforzamos por evitar los prejuicios. Como equipo central, obviamente nos gusta mucho Vue. Hay algunos problemas que creemos que resuelve mejor que cualquier otra opción. Si no creyéramos eso, no estaríamos trabajando en ello. Sin embargo, queremos ser justos y precisos. Mientras que otras librerías ofrecen ventajas significativas, como el vasto ecosistema de renderizadores alternativos de React o la compatibilidad con navegadores de Knockout con IE6, también intentamos enumerarlas.

También nos gustaría **su** ayuda para mantener este documento actualizado porque el mundo JavaScript se mueve rápido! Si usted nota una inexactitud o algo que no parece correcto, por favor háganoslo saber [creando un issue](https://github.com/vuejs/vuejs.org/issues/new?title=Inaccuracy+in+comparisons+guide).

## React

React y Vue comparten muchas similitudes. Ambos:

- utilizan un DOM virtual
- proporcionan componentes de vista reactivos y componibles
- mantienen el enfoque en la librería central, con temas como el enrutamiento y la gestión global del estado manejadas por librerías asociadas

Siendo tan similares en alcance, hemos dedicado más tiempo a afinar esta comparación que cualquier otra. Queremos garantizar no sólo la precisión técnica, sino también el equilibrio. Señalamos dónde React supera a Vue, por ejemplo en la riqueza de su ecosistema y la abundancia de sus renderizadores personalizados.

Dicho esto, es inevitable que la comparación parezca sesgada hacia Vue para algunos usuarios de React, ya que muchos de los temas explorados son hasta cierto punto subjetivos. Reconocemos la existencia de diferentes gustos técnicos, y esta comparación tiene como objetivo principal esbozar las razones por las que Vue podría ser potencialmente una mejor opción si sus preferencias coinciden con las nuestras.

La comunidad de React [ha sido fundamental](https://github.com/vuejs/vuejs.org/issues/364) para ayudarnos a lograr este equilibrio, con un agradecimiento especial a Dan Abramov del equipo de React. Fue extremadamente generoso con su tiempo y su considerable experiencia para ayudarnos a refinar este documento hasta que estuvimos [ambos contentos](https://github.com/vuejs/vuejs.org/issues/364#issuecomment-244575740) con el resultado final.

### Rendimiento

Tanto React como Vue ofrecen un rendimiento comparable en los casos de uso más comunes, con Vue normalmente un poco por delante debido a su implementación más ligera del DOM virtual. Si le interesan los números, puede consultar este [benchmark independiente](https://rawgit.com/krausest/js-framework-benchmark/master/webdriver-ts/table.html) que se centra en el rendimiento de renderizado/actualización en bruto. Observe que esto no tiene en cuenta estructuras de componentes complejas, por lo que sólo debería considerarse una referencia y no un veredicto.

#### Esfuerzos de optimización

En React, cuando el estado de un componente cambia, activa el re-renderizado de todo el subárbol de componentes, comenzando en ese componente como raíz. Para evitar repeticiones innecesarias de componentes hijo, necesita usar `PureComponent` o implementar `shouldComponentUpdate` siempre que pueda. También es posible que necesite utilizar estructuras de datos inmutables para que los cambios de estado sean más fáciles de optimizar. Sin embargo, en algunos casos puede que no pueda confiar en dichas optimizaciones porque `PureComponent/shouldComponentUpdate` asume que el resultado del renderizado de todo el subárbol está determinado por los props del componente actual. Si ese no es el caso, entonces tales optimizaciones pueden llevar a un estado DOM inconsistente.

En Vue, las dependencias de un componente se rastrean automáticamente durante su renderizado, por lo que el sistema sabe con precisión qué componentes deben volver a renderizarse cuando cambia el estado. Se puede considerar que cada componente tiene `shouldComponentUpdate` automáticamente implementado, sin las precauciones de los componentes anidados.

En general, esto le elimina la necesidad de toda una clase de optimizaciones de rendimiento a los desarrolladores, y les permite centrarse más en la construcción de la aplicación en sí misma a medida que va escalando.

### HTML Y CSS

En React, todo es únicamente JavaScript. No sólo las estructuras HTML se expresan a través de JSX, sino que las tendencias recientes también apuntan a poner la gestión de CSS dentro de JavaScript. Este enfoque tiene sus propios beneficios, pero también viene con varias desventajas que no parecen valer la pena para todos los desarrolladores.


Vue adopta las tecnologías web clásicas y construye a partir de ellas. Para mostrarles lo que eso significa, nos sumergiremos en algunos ejemplos.

#### JSX vs Plantillas

En React, todos los componentes expresan su interfaz de usuario dentro de las funciones de render utilizando JSX, una sintaxis declarativa similar a XML que funciona con JavaScript.

Las funciones de renderizado con JSX tienen algunas ventajas:

- Puede aprovechar la potencia de un lenguaje de programación completo (JavaScript) para crear su vista. Esto incluye variables temporales, controles de flujo y referencias directas a los valores JavaScript en el ámbito de aplicación.

- El soporte de herramientas (p.e. linting, comprobación de tipos, autocompletado del editor) para JSX es en algunos aspectos más avanzado que el disponible actualmente para las plantillas de Vue.

En Vue, también tenemos [funciones de render](render-function.html) e incluso [soporte JSX](render-function.html#JSX), porque a veces se necesita esa potencia. Sin embargo, como experiencia por defecto ofrecemos plantillas como una alternativa más simple. Cualquier HTML válido es también una plantilla Vue válida, y esto lleva a algunas ventajas propias:

- Para muchos desarrolladores que han trabajado con HTML, las plantillas se sienten más naturales para leer y escribir. La preferencia en sí misma puede ser algo subjetiva, pero si hace que el desarrollador sea más productivo, entonces el beneficio es objetivo.

- Las plantillas basadas en HTML hacen mucho más fácil la migración progresiva de las aplicaciones existentes para aprovechar las características de reactividad de Vue.

- También hace que sea mucho más fácil para los diseñadores y desarrolladores menos experimentados analizar y contribuir a la base de código.

- Incluso puede utilizar preprocesadores como Pug (antes conocido como Jade) para crear sus plantillas de Vue.

Algunos argumentan que necesitarías aprender un DSL (Domain-Specific Language) extra para poder escribir plantillas - creemos que esta diferencia es superficial en el mejor de los casos. Primero, JSX no significa que el usuario no necesite aprender nada - es sintaxis adicional encima del JavaScript regular, así que puede ser fácil para alguien familiarizado con JavaScript aprender, pero decir que es esencialmente gratis es engañoso. Del mismo modo, una plantilla es sólo una sintaxis adicional encima de HTML regular y, por lo tanto, tiene un coste de aprendizaje muy bajo para aquellos que ya están familiarizados con HTML. Con el DSL también podemos ayudar al usuario a hacer más con menos código (por ejemplo, los modificadores `v-on`). La misma tarea puede implicar mucho más código cuando se utilizan funciones JSX o de render.

En un nivel superior, podemos dividir los componentes en dos categorías: los de presentación y los lógicos. Recomendamos el uso de plantillas para los componentes de presentación y la función de render / JSX para los lógicos. El porcentaje de estos componentes depende del tipo de aplicación que estés construyendo, pero en general encontramos que los de presentación son mucho más comunes.

#### CSS con alcance a componentes

A menos que extienda los componentes sobre múltiples archivos (por ejemplo, con [Módulos CSS](https://github.com/gajus/react-css-modules)) el alcance de CSS en React suele hacerse a través de soluciones CSS-en-JS (por ejemplo, [componentes de estilo](https://github.com/styled-components/styled-components), [glamorous](https://github.com/paypal/glamorous), y [emotion](https://github.com/emotion-js/emotion)). Esto introduce un nuevo paradigma de estilo orientado a componentes que es diferente del proceso normal de creación de CSS. Además, aunque hay soporte para extraer CSS en una sola hoja de estilo en el momento de la compilación, sigue siendo común que se necesite incluir un tiempo de ejecución en el paquete para que el estilo funcione correctamente. Mientras que usted obtiene acceso al dinamismo de JavaScript mientras construye sus estilos, la compensación es a menudo el aumento del tamaño del paquete y el costo del tiempo de ejecución.

Si eres un fan de CSS-en-JS, muchas de las librerías populares de CSS-en-JS soportan Vue (por ejemplo, [styled-components-vue](https://github.com/styled-components/vue-styled-components) y [vue-emotion](https://github.com/egoist/vue-emotion)). La principal diferencia entre React y Vue aquí es que el método por defecto de estilado en Vue es a través de etiquetas `style` más familiares en [componentes de un solo archivo](single-file-components.html).

Los [Componentes de un solo archivo](single-file-components.html) le dan acceso completo a CSS en el mismo archivo que el resto del código de su componente.

``` html
<style scoped>
  @media (min-width: 250px) {
    .list-container:hover {
      background: orange;
    }
  }
</style>
```

El atributo opcional `scoped` incluye automáticamente este CSS en su componente añadiendo un atributo único (como `data-v-21e5b78`) a los elementos y compilando `.list-container:hover` a algo como `.list-container[data-v-21e5b78]:hover`.

Por último, el estilo de los componentes de un solo archivo de Vue es muy flexible. A través de [vue-loader](https://github.com/vuejs/vue-loader), puede utilizar cualquier preprocesador, post-procesador e incluso integración profunda con [Módulos CSS](https://vue-loader.vuejs.org/en/features/css-modules.html) -- todo dentro del elemento `<style>`.

### Escala

#### Gran escala

Para aplicaciones grandes, tanto Vue como React ofrecen soluciones de enrutamiento robustas. La comunidad de React también ha sido muy innovadora en términos de soluciones de gestión de estado (por ejemplo, Flux/Redux). Estos patrones de gestión de estado e [incluso el propio Redux](https://github.com/egoist/revue) pueden integrarse fácilmente en las aplicaciones Vue. De hecho, Vue ha llevado este modelo un paso más allá con [Vuex](https://github.com/vuejs/vuex), una solución de gestión de estado inspirada en Elm que se integra profundamente en Vue y que creemos ofrece una experiencia de desarrollo superior.

Otra diferencia importante entre estas ofertas es que las librerías adicionales de Vue para la gestión de estados y enrutamiento (entre [otros asuntos] (https://github.com/vuejs)) están todas oficialmente soportadas y se mantienen actualizadas con la librería central. React, en cambio, opta por dejar estas preocupaciones en manos de la comunidad, creando un ecosistema más fragmentado. Siendo más popular, sin embargo, el ecosistema de React es considerablemente más rico que el de Vue.

Finalmente, Vue ofrece un [generador de proyectos CLI](https://github.com/vuejs/vue-cli) que hace que sea trivialmente fácil comenzar un nuevo proyecto usando el sistema de compilación elegido, incluyendo [webpack](https://github.com/vuejs-templates/webpack), [Browserify](https://github.com/vuejs-templates/browserify), o incluso [ningún sistema de compilación](https://github.com/vuejs-templates/simple). React también está haciendo progresos en esta área con [create-react-app](https://github.com/facebookincubator/create-react-app), pero actualmente tiene algunas limitaciones:

- No permite ninguna configuración durante la generación del proyecto, mientras que las plantillas de proyecto de Vue permiten una personalización similar a la de [Yeoman](http://yeoman.io/).
- Sólo ofrece una única plantilla que asume que está construyendo una aplicación de una sola página, mientras que Vue ofrece una amplia variedad de plantillas para diversos propósitos y sistemas de construcción.
- No puede generar proyectos a partir de plantillas construidas por el usuario, lo que puede ser especialmente útil para entornos empresariales con convenciones preestablecidas.

Es importante notar que muchas de estas limitaciones son decisiones de diseño intencionales tomadas por el equipo de create-react-app y tienen sus ventajas. Por ejemplo, siempre y cuando las necesidades de su proyecto sean muy simples y no necesite "expulsar" para personalizar su proceso de construcción, podrá actualizarlo como una dependencia. Puede leer más sobre esta [filosofía diferente aquí](https://github.com/facebookincubator/create-react-app#philosophy).

#### Pequeña escala

React es conocido por su pronunciada curva de aprendizaje. Antes de que pueda empezar, necesita saber sobre JSX y probablemente ES2015+, ya que muchos ejemplos usan la sintaxis de clases de React. También tiene que aprender sobre sistemas de compilación, porque aunque técnicamente podría usar Babel Standalone para compilar su código en vivo en el navegador, no es para nada adecuado en un entorno de producción.

Mientras que Vue se escala tan bien o mejor que React, además se escala tan bien como jQuery. Así es - todo lo que tiene que hacer es agregar una sola etiqueta de script a una página:

``` html
<script src="https://cdn.jsdelivr.net/npm/vue"></script>
```

Luego puede empezar a escribir código Vue e incluso enviar la versión minificada a producción sin sentirte culpable o tener que preocuparse por problemas de rendimiento.

Dado que no necesita saber acerca de JSX, ES2015, o sistemas de compilación para empezar con Vue, también suele llevar a los desarrolladores menos de un día leer [la guía](./) para aprender lo suficiente como para construir aplicaciones no triviales.

### Renderización nativa

React Native le permite escribir aplicaciones nativas para iOS y Android utilizando el mismo modelo de componentes de React. Esto es fantástico, ya que como desarrollador, puede aplicar sus conocimientos de un framework a través de múltiples plataformas.  En este frente, Vue tiene una colaboración oficial con [Weex](https://alibaba.github.io/weex/), un framework de UI multiplataforma desarrollado por Alibaba Group, que utiliza Vue como su framework de tiempo de ejecución de JavaScript. Esto significa que con Weex, usted puede usar la misma sintaxis de Vue para crear componentes que no sólo pueden ser renderizados en el navegador ¡ sino también de forma nativa en iOS y Android!

En este momento, Weex todavía está en desarrollo activo y no está tan maduro y probado como React Native, pero su desarrollo está impulsado por las necesidades de producción del mayor negocio de comercio electrónico del mundo, y el equipo de Vue también colaborará activamente con el equipo de Weex para asegurar una experiencia sin problemas para los desarrolladores de Vue.

Otra opción que pronto tendrán los desarrolladores de Vue es [NativeScript](https://www.nativescript.org/), a través del [plugin impulsado por la comunidad](https://github.com/rigor789/nativescript-vue).

### Con MobX

MobX se ha vuelto muy popular en la comunidad de React y en realidad utiliza un sistema de reactividad casi idéntico a Vue. Hasta cierto punto, el flujo de trabajo de React + MobX puede considerarse como un Vue más extenso, así que si estás usando esa combinación y la estás disfrutando, saltar a Vue es probablemente el siguiente paso lógico.

## AngularJS (Angular 1)

Una buena parte de la sintaxis de Vue se verá muy similar a AngularJS (por ejemplo, `v-if` vs `ng-if`). Esto se debe a que hubo muchas cosas que AngularJS acertó y que fueron una inspiración para Vue desde etapas tempranas en su desarrollo. Sin embargo, también hay muchos problemas que vienen con AngularJS, donde Vue ha intentado ofrecer una mejora significativa.

### Complejidad

Vue es mucho más simple que AngularJS, tanto en términos de API como de diseño. Aprender lo suficiente para construir aplicaciones no triviales típicamente toma menos de un día, lo cual no es el caso para AngularJS.

### Flexibilidad y modularidad

AngularJS tiene una fuerte opinión sobre cómo deben estructurarse sus aplicaciones, mientras que Vue es una solución más flexible y modular. Aunque esto hace que Vue sea más adaptable a una amplia variedad de proyectos, también reconocemos que a veces es útil que algunas decisiones se tomen por usted, para que pueda empezar a codificar.

Es por eso que ofrecemos una [plantilla webpack](https://github.com/vuejs-templates/webpack) que puede configurarse en cuestión de minutos, a la vez que le permite acceder a funciones avanzadas como la recarga de módulos en marcha, linting, extracción de CSS y mucho más.

### Vinculación de datos

AngularJS utiliza la vinculación de dos vías entre diferentes alcances, mientras que Vue refuerza un flujo de datos unidireccional entre los componentes. Esto hace que el flujo de datos sea más fácil de razonar en aplicaciones no triviales.

### Directivas vs. Componentes

Vue tiene una separación más clara entre directivas y componentes. Las directivas están destinadas a encapsular únicamente las manipulaciones DOM, mientras que los componentes son unidades autónomas que tienen su propia visión y lógica de datos. En AngularJS, hay mucha confusión entre los dos.

### Rendimiento

Vue tiene un mejor rendimiento y es mucho, mucho más fácil de optimizar porque no utiliza la "comprobación sucia". AngularJS se vuelve lento cuando hay muchos watchers, porque cada vez que algo cambia en el alcance, todos estos watchers necesitan ser reevaluados de nuevo. Además, el ciclo de digestión puede tener que ejecutarse varias veces para "estabilizarse" si algún watcher activa otra actualización. Los usuarios de AngularJS a menudo tienen que recurrir a técnicas esotéricas para sortear el ciclo de digestión, y en algunas situaciones, no hay manera de optimizar un alcance con muchos watchers.

Vue no sufre de esto en absoluto porque utiliza un sistema transparente de observación de seguimiento de dependencias con colas asíncronas - todos los cambios se activan de forma independiente a menos que tengan relaciones de dependencia explícitas.

Interesantemente, hay bastantes similitudes en cómo Angular y Vue están abordando estos temas de AngularJS.

## Angular (anteriormente conocido como Angular 2)

Tenemos una sección separada para el nuevo Angular porque realmente es un framework completamente diferente de AngularJS. Por ejemplo, cuenta con un sistema de componentes de primera clase, muchos detalles de implementación han sido completamente reescritos, y la API también ha cambiado drásticamente.

### TypeScript

Angular requiere esencialmente el uso de TypeScript, dado que casi toda su documentación y recursos de aprendizaje están basados en TypeScript. TypeScript tiene sus ventajas: la comprobación estática de tipos puede ser muy útil para aplicaciones a gran escala y puede suponer un gran aumento de la productividad para desarrolladores con experiencia en Java y C#.

Sin embargo, no todos quieren usar TypeScript. En muchos casos de uso a pequeña escala, la introducción de un sistema de tipado puede resultar en más gastos generales que un aumento de la productividad. En esos casos, sería mejor ir con Vue en su lugar, ya que usar Angular sin TypeScript puede ser un reto.

Por último, aunque no tan profundamente integrado con TypeScript como lo está Angular, Vue también ofrece [typings oficiales](https://github.com/vuejs/vue/tree/dev/types) y [decoradores oficiales](https://github.com/vuejs/vue-class-component) para aquellos que deseen utilizar TypeScript con Vue. También estamos colaborando activamente con los equipos TypeScript y VSCode de Microsoft para mejorar la experiencia de TS/IDE para los usuarios de Vue + TS.

### Tamaño y rendimiento

En términos de rendimiento, ambos frameworks son excepcionalmente rápidos y no hay suficientes datos de casos de uso en el mundo real para hacer un veredicto. Sin embargo, si usted está determinado a ver algunos números, Vue 2.0 parece estar por delante de Angular de acuerdo con este [benchmark independiente](http://stefankrause.net/js-frameworks-benchmark4/webdriver-ts/table.html).

Las versiones recientes de Angular, con [compilación AOT](https://en.wikipedia.org/wiki/Ahead-of-time_compilation) y [tree-shaking](https://en.wikipedia.org/wiki/Tree_shaking), han sido capaces de reducir considerablemente su tamaño. Sin embargo, un proyecto completo de Vue 2 con  Vuex + Vue Router incluido (~30KB gzipped) sigue siendo significativamente más ligero que una aplicación lista para usar, compilada por AOT y generada por `angular-cli` (~130KB gzipped).

### Flexibilidad

Vue es mucho menos dogmático que Angular, ofreciendo soporte oficial para una variedad de sistemas de construcción, sin restricciones sobre cómo estructurar su aplicación. Muchos desarrolladores disfrutan de esta libertad, mientras que algunos prefieren tener sólo una forma correcta de construir cualquier aplicación.

### Curva de aprendizaje

Para empezar con Vue, todo lo que necesita es familiarizarse con HTML y ES5 JavaScript (es decir, JavaScript puro). Con estas habilidades básicas, usted puede empezar a construir aplicaciones no triviales en menos de un día después de leer [la guía](./).

La curva de aprendizaje de Angular es mucho más pronunciada. La superficie de la API del framework es enorme y como usuario necesitará familiarizarse con muchos más conceptos antes de ser productivo. La complejidad de Angular se debe en gran medida a su objetivo de diseño de apuntar sólo a aplicaciones grandes y complejas - pero eso hace que el framework sea mucho más difícil de entender para los desarrolladores con menos experiencia.

## Ember

Ember es un framework con múltiples funcionalidades que está diseñado para ser opinionado. Proporciona una gran cantidad de convenciones establecidas y una vez que se está lo suficientemente familiarizado con ellas, puede ser muy productivo. Sin embargo, también significa que la curva de aprendizaje es alta y la flexibilidad se perjudica. Es un intercambio cuando se trata de elegir entre un framework opinionado y una librería con un conjunto de herramientas que trabajan juntas. La segunda opción le da más libertad, pero también requiere que tome más decisiones de arquitectura.

Dicho esto, probablemente sería una mejor comparación entre el núcleo de Vue y las [plantillas](https://guides.emberjs.com/v2.10.0/templates/handlebars-basics/) y capas de [modelo de objetos](https://guides.emberjs.com/v2.10.0/object-model/) de Ember:

- Vue proporciona una reactividad no intrusiva en objetos JavaScript simples y propiedades calculadas totalmente automáticas. En Ember, se necesita envolver todo en objetos de Ember y declarar manualmente las dependencias para las propiedades calculadas.

- La sintaxis de las plantillas de Vue aprovecha toda la potencia de las expresiones JavaScript, mientras que en comparación, la de las expresiones de Handlebars y la sintaxis de ayuda es intencionalmente limitada.

- En cuanto al rendimiento, Vue supera a Ember [por un margen considerable](https://rawgit.com/krausest/js-framework-benchmark/master/webdriver-ts/table.html), incluso después de la última actualización del motor Glimmer en Ember 2.x. Vue se encarga automáticamente de las actualizaciones por lotes, mientras que en Ember es necesario gestionar manualmente los bucles de ejecución en situaciones críticas para el rendimiento.

## Knockout

Knockout fue pionero en el MVVM y en el seguimiento de espacios de dependencia y su sistema de reactividad es muy similar al de Vue. Su [compatibilidad con navegadores](http://knockoutjs.com/documentation/browser-support.html) es también impresionante considerando todo lo que hace, ¡Y hasta con compatibilidad con IE6! Vue, por otro lado, sólo soporta IE9+.

Con el tiempo, sin embargo, el desarrollo de Knockout se ha ralentizado y ha comenzado a mostrar un poco su envejecimiento. Por ejemplo, su sistema de componentes carece de un conjunto completo de hooks del ciclo de vida y aunque es un caso de uso muy común, la interfaz para pasar  hijos a un componente se siente un poco torpe en comparación con la de [Vue](components.html#Content-Distribution-with-Slots).

También parece haber diferencias filosóficas en el diseño de la API que, si tienes curiosidad, pueden ser demostradas por la forma en que cada uno maneja la creación de una [simple lista de tareas](https://gist.github.com/chrisvfritz/9e5f2d6826af00fcbace7be8f6dccb89). Definitivamente es algo subjetivo, pero muchos consideran que la API de Vue es menos compleja y está mejor estructurada.

## Polymer

Polymer es otro proyecto patrocinado por Google y, de hecho, también fue una fuente de inspiración para Vue. Los componentes de Vue pueden compararse de forma general con los elementos personalizados de Polymer y ambos proporcionan un estilo de desarrollo muy similar. La mayor diferencia es que Polymer se basa en las características más recientes de los Web Components y requiere que de polyfills no triviales para funcionar (con un rendimiento degradado) en los navegadores que no admiten esas características de forma nativa. Por el contrario, Vue funciona sin dependencias ni polyfills hasta IE9.

En Polymer 1.0, el equipo también ha hecho que su sistema de vinculación de datos sea muy limitado para compensar el rendimiento. Por ejemplo, las únicas expresiones soportadas en las plantillas de Polymer son la negación booleana y las llamadas de un solo método. Su implementación de propiedades calculadas tampoco es muy flexible.

Los elementos personalizados de Polymer se crean en archivos HTML, lo que lo limita a JavaScript/CSS común y corriente (y a las funciones de lenguaje soportadas por los navegadores actuales). En comparación, los componentes de un solo archivo de Vue le permiten usar fácilmente ES2015+ y cualquier preprocesador CSS que desee.

Cuando se implementa en producción, Polymer recomienda cargar todo sobre la marcha con HTML Imports, que asume que los navegadores implementan esta especificación, y soporte HTTP/2 tanto en el servidor como en el cliente. Esto puede o no ser factible dependiendo de su audiencia meta y del entorno de implementación. En los casos en que esto no sea deseable, tendrá que utilizar una herramienta especial llamada Vulcanizer para agrupar los elementos de Polymer. En este frente, Vue puede combinar su función de componente asíncrono con la función de división de código de webpack para dividir fácilmente partes del paquete de aplicaciones para que se carguen de forma diferida. Esto asegura la compatibilidad con los navegadores más antiguos a la vez que mantiene un gran rendimiento en la carga de aplicaciones.

También es totalmente factible ofrecer una integración más profunda entre Vue y las especificaciones de los Web Components, tales como Elementos Personalizados y encapsulación de estilos por Shadow DOM - sin embargo, en este momento todavía estamos esperando a que las especificaciones maduren y se implementen ampliamente en todos los navegadores convencionales antes de hacer cualquier compromiso serio.

## Riot

Riot 3.0 proporciona un modelo de desarrollo similar basado en componentes (llamado "tag" en Riot), con una API mínima y hermosamente diseñada. Riot y Vue probablemente comparten mucho en filosofías de diseño. Sin embargo, a pesar de ser un poco más pesado que Riot, Vue ofrece algunas ventajas significativas:

- Mejor rendimiento. Riot [atraviesa un árbol DOM](http://riotjs.com/compare/#virtual-dom-vs-expressions-binding) en lugar de usar un DOM virtual, por lo que sufre de los mismos problemas de rendimiento que AngularJS.
- Soporte de herramientas más maduro. Vue proporciona apoyo oficial para [webpack](https://github.com/vuejs/vue-loader) y [Browserify](https://github.com/vuejs/vueify), mientras que Riot depende del apoyo de la comunidad para construir la integración de sistemas.
