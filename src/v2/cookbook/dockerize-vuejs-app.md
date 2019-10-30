---
title: Dockerize Aplikasi Vue.js App
type: cookbook
order: 13
---
<!-- docs/hooks-faq.md ini diterjemahkan oleh dummyeuy (Muhammad Ghalib) -->

## Contoh Sederhana

Jadi, Anda membangun aplikasi Vue.js pertama Anda menggunakan [templat *webpack* Vue.js](https://github.com/vuejs-templates/webpack) yang menakjubkan dan kini sangat ingin menunjukkannya pada teman-teman Anda dengan sebuah mendemonstrasi yang mana bisa Anda jalankan juga pada sebuah wadah *Docker*.

Mari mulai dengan membuat sebuah`Dockerfile` di folder dasar proyek kita:

```docker
FROM node:lts-alpine

# pasang (install) server http sederhana untuk menjalankan static content
RUN npm install -g http-server

# buat folder 'app' pada direktori yang sedang dikerjakan
WORKDIR /app

# salin 'package.json' dan 'package-lock.json' (jika ada)
COPY package*.json ./

# pasang dependecy proyek
RUN npm install

# salin berkas-berkas proyek serta folder-foldernya ke direktori yang sedang dikerjakan (misal. folder 'app)
COPY . .

# bangun aplikasi untuk produksi dengan minifikasi
RUN npm run build

EXPOSE 8080
CMD [ "http-server", "dist" ]
```

Awalnya mungkin terlihat berlebihan untuk menyalin `package.json` dan `package-lock.json` serta seluruh berkas proyek dalam dua langkah terpisah, tetapi sebenarnya ada sebuah[alasan baik di baliknya](http://bitjudo.com/blog/2014/03/13/building-efficient-dockerfiles-node-dot-js/) (*spoiler*: hal tersebut mengizinkan kita untuk memanfaatkan lapisan-lapisan Docker dengan *cache*).

Sekarang ayo buat tampilan *Docker* untuk aplikasi Vue.js kita:

```bash
docker build -t vuejs-cookbook/dockerize-vuejs-app .
```

Akhirnya, saatnya jalankan aplikasi Vue.js kita di sebuah wadah *Docker*:

```bash
docker run -it -p 8080:8080 --rm --name dockerize-vuejs-app-1 vuejs-cookbook/dockerize-vuejs-app
```

Kita seharusnya dapat mengakses aplikasi Vue.js kita di `localhost:8080`.

## Contoh Dunia Nyata

Pada contoh sebelumnya, kita menggunakan sebuah *command-line* [http server](https://github.com/indexzero/http-server) yang sederhana dan tanpa konfigurasi tertentu untuk menjalankan aplikasi Vue.js kita - yang mana sangat cocok untuk *prototyping* cepat dan _bisa jadi_ baik untuk skenario produksi-produksi sederhana. Lagipula, dokumentasinya mengatakan demikian:

> Hal tersebut cukup baik untuk penggunaan dalam hal produksi, tapi juga cukup sederhana dan mudah diretas untuk pengujian, pengembangan lokal, serta pembelajaran.

Meskipun demikian, untuk kasus-kasus produksi yang kompleks secara nyata, akan lebih bijak untuk mengandalkan beberapa nama besar seperti [*NGINX*](https://www.nginx.com/) atau [*Apache*](https://httpd.apache.org/) dan itulah hal yang akan kita lakukan selanjutnya: kita akan  we are about memanfaatkan *NGINX* untuk menjalankan aplikasi Vue.js kita karena hal tersebut dipertimbangkan sebagai salah satu solusi dan pihak yang telah teruji dengan sangat baik.

Mari me-*refactor* `Dockerfile` kita untuk menggunakan *NGINX*:

 ```docker
# tahap pengembangan
FROM node:lts-alpine as build-stage
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# tahap produksi
FROM nginx:stable-alpine as production-stage
COPY --from=build-stage /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

Baik, mari kita lihat apa yang terjadi kini:
* kita sudah memisahkan `Dockerfile` asli milik kita ke dalam beberapa tahapan dengan memanfaatkan fitur [pengembangan *multi-stage*](https://docs.docker.com/develop/develop-images/multistage-build/) Docker;
* tahap pertama bertujuan untuk mengembangkan sebuah *artefak* yang siap prduksi dari aplikasi Vue.js kita;
* tahap kedua bertujuan untuk menjalankan *artefak* tersebut mengguankan *NGINX*.

Kini ayo bangun tampilan *Docker* dari aplikasi Vue.js kita:

```bash
docker build -t vuejs-cookbook/dockerize-vuejs-app .
```

Pada akhirnya, jalankan aplikasi Vue.js kita dalam wadah *Docker*:

```bash
docker run -it -p 8080:80 --rm --name dockerize-vuejs-app-1 vuejs-cookbook/dockerize-vuejs-app
```

Kita seharusnya bisa mengakses aplikasi Vue.js kita di `localhost:8080`.

## Konteks Tambahan

Jika Anda membaca *cookbook* ini, ada kemungkinan Anda sudah tahu alasan mengapa Anda memilih untuk men-*dockerize* aplikasi Vue.js Anda. Tetapi jika Anda hanya tiba di laman ini tanpa alasan spesifik seperti di atas, izinkan kami bagikan pada Anda beberapa alasan baik mengapa membaca *cookbook* ini bermanfaat.

Tren modern kini adalah membangun aplikasi menggunakan pendekatan [*Cloud-Native*](https://pivotal.io/cloud-native) yang mana merevolusi terutama pada hal-hal berikut:
* *Microservice*
* *DevOps* (*Development and Operations*/ Pengembangan dan Operasi)
* *Delivery* secara kontinyu

Mari lihat bagaimana konsep-konsep ini sebenarnya mempengaruhi keputusan kita dalam hal proses *dockerize* aplikasi Vue.js kita.

### Efek *Microservice*

Dengan mengadopsi [gaya arsitektural *microservice*](https://martinfowler.com/microservices/), kita berakhir pada membangun sebuah aplikasi tunggal sebagai sebuah rangkaian layanan-layanan (*service*) kecil, tiap layanannya berjalan pada prosesnya sendiri dan berkomunikasi dengan mekanisme yang ringan. Layanan ini dibangun di sekitar kapabilitas bisnis dan secara independen dapat diluncurkan oleh mesin peluncuran (*deployment*) yang sepenuhnya otomatis.

Jadi, memutuskan untuk menerapkan pendekatan arsitektural ini sering kali berdampak pada pengembangan dan peluncuran *front-end* kita sebagai sebuah layanan yang independen.

### Efek *DevOps*

Mengadopsi kultur [*DevOps*](https://martinfowler.com/bliki/DevOpsCulture.html), perlengkapan serta praktik-praktik teknis yang tangkas (*agile*), di antara hal lain, telah memiliki dampak baik pada meningkatnya kolaborasi antara peran-peran dalam pengembangan dan operasi (*development and operations*). Masalah utama di masa lalu (tapi juga hingga hari ini pada beberapa kasus) adalah tim pengembang cenderung tidak tertarik dalam hal operasi dan pemeliharaan (*maintenance*) sistem selepas produk sudah dipindahtangankan pada tim operasi, ketika tim yang terakhir cenderung tidak begitu sadar akan tujuan bisnis sistem ini serta, oleh karenanya, dengan berat hati berusaha memuaskan kebutuhan operasional sistem (juga disebut-sebut sebagai "ke-pengecut-an pengembang").

Jadi, menyerahkan aplikasi Vue.js sebagai sebuah tampilan Docker membantu mengurangi -jika tidak menghilangkan seluruhnya- perbedaan antara menjalankan layanan di laptop pengembang, lingkungan pengembangan atau lingkungan apapun yang kita pikirkan.

### Efek *Delivery* secara Kontinyu

Dengan memanfaatkan [*delivery* secara kontinyu](https://martinfowler.com/bliki/ContinuousDelivery.html) secara teratur kita membangun perangkat lunak dengan cara yng mana bisa dirilis kapan pun secara potensial. Praktik teknis demikian diperbolehkan agar [*delivery pipeline* berjalan secara kontinyu](https://martinfowler.com/bliki/DeploymentPipeline.html). Tujuan *delivery pipeline* secara kontinyu ini untuk membagi pengembangan menjadi beberapa tahap (misal, kompilasi, uji unit, uji integrasi, uji performa, dsb.) dan memperbolehkan tiap tahap memverifikasi artefak pengembangan kita kapanpun perangkat lunak kita berubah. Pada akhirnya, tiap tahap meningkatkan kepercayaan diri kita dalam hal kesiapan produksi pada artifak yang kita kembangkan, oleh karenanya, mengurangi resiko rusaknya beberapa hal dalam tahapan produksi (atau lingkungan lain yang penting).

Jadi, membuat tampilan *Docker* aplikasi Vue.js adalah pilihan yang baik di sini karena hal tersebut akan merepresentasikan hasil akhir pengembangan artefak kita, barang yang sama yang akan diverifikasi dengan *delivery pipeline* kotinyu kita serta secara potensial dapat dirilis ke tahap produksi dengan yakin.

## Pola-pola Alternatif

Jika perusahaan Anda sekarang belum mengadopsi *Docker* dan/atau *Kubernetes* atau Anda hanya ingin meningkatkan kapabilitas diri Anda jadi yang terbaik, mungkin saja me-*dockerize* aplikasi Vue.js bukanlah hal yang Anda butuhkan.

Alternatif-alternatif umum lainnya:
* memanfaatkan sebuah *platform* yang *all-in-one* seperti [*Netlify*](https://www.netlify.com/);
* men-*hosting* *SPA* Anda di [*Amazon S3*](https://aws.amazon.com/s3/) dan menjalankannya dengan [*Amazon CloudFront*](https://aws.amazon.com/cloudfront/) (lihat [tautan ini](https://serverless-stack.com/chapters/deploy-the-frontend.html) untuk penduan lebih rinci).
