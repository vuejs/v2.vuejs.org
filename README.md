# vi.vuejs.org

Đây là phiên bản tiếng Việt chính thức của [trang chủ Vue.js](https://vuejs.org), có địa chỉ web là [https://vi.vuejs.org](https://vi.vuejs.org). Cũng như bản gốc tiếng Anh, bản dịch này được viết bằng [hexo](http://hexo.io/). Nội dung của trang được viết với định dạng [Markdown](https://guides.github.com/features/mastering-markdown/) và chứa trong thư mục `src`. Mọi đóng góp dù lớn hay nhỏ cũng đều được hoan nghênh.

Để tham gia phát triển phiên bản này, các bạn chỉ cần làm theo các bước sau:

1. Fork repo này
1. Cài đặt tất cả các gói phụ thuộc (dependencies): `npm i`
1. Mở server dev ở [`localhost:4000`](http://localhost:4000): `npm start`

Bây giờ bạn có thể chỉnh sửa các file trong thư mục `src` và refresh trình duyệt để kiểm tra kết quả chỉnh sửa.

## Quy ước khi đóng góp

Vì phiên bản này mới chỉ được bắt đầu, chúng tôi sẽ tập trung vào các file chưa dịch thay vì chỉnh sửa các file đã dịch xong (tuy vậy, nếu có sai sót gì nghiêm trọng ở các file đã dịch, rất hoan nghênh sự đóng góp của các bạn). Để bắt đầu dịch một file mới, vui lòng thực hiện theo quy ước sau:

* Chỉ dịch một file cho mỗi PR
* Trước khi bắt tay vào dịch một file, hãy kiểm tra trên [trang PR](https://github.com/vuejs-vn/vuejs.org/pulls?utf8=%E2%9C%93&q=is%3Apr) xem có ai đã hoặc đang dịch file đó hay chưa
* Tạo một branch mới từ `master` với tên là đường dẫn đến file đó, ví dụ `src/v2/guide/instance.md`
* Tạo một thay đổi nhỏ để submit PR vào `master`, với tên PR là `[WIP] /path/to/file.md`
* Tiếp tục quá trình dịch ở local và push commit vào PR này
* Sau khi phần dịch đã hoàn tất, xóa cụm `[WIP]` khỏi tên PR và tag một hay vài [thành viên chính](https://github.com/vuejs-vn/vuejs.org#thành-viên) vào PR

## Lưu ý khi dịch

Do sự khác biệt về ngôn ngữ và những đặc thù của tiếng Việt, sẽ có những khó khăn nhất định khi dịch. Vì vậy, có một số lưu ý như sau:

* Không nhất thiết phải dịch toàn bộ từ hoặc cụm từ sang tiếng Việt, nhất là những từ chuyên ngành (framework, file, component…)
* Đối với những từ dịch được nhưng nghe lạ tai trong tiếng Việt, hãy dùng quy ước `tiếng Anh (nghĩa tiếng Việt)` cho lần đầu tiên, và dùng tiếng Anh từ đó về sau. Ví dụ:
> **Router (bộ định tuyến)** là một thành phần quan trọng trong các ứng dụng JavaScript hiện đại. Vue.js có một **router** chính thức tên là vue-router…
* Đối với những từ hoặc cụm từ hoàn toàn không có từ ngữ tương đương trong tiếng Việt, hãy thông báo để chúng tôi thảo luận với core team và chọn từ hay cụm từ có ý nghĩa tương đương. Một ví dụ là từ "Progressive" đã được dịch thoáng thành "linh hoạt" (flexible) sau khi thảo luận với Evan You.
* Không nhất thiết phải dịch 1:1. Đôi khi chúng ta nên thêm hoặc bớt vài từ hoặc thậm chí là cả một câu để bản dịch được tự nhiên hơn, miễn là truyền tải được đúng và đủ ý.
* Không nên dùng Title Case vì tiếng Việt ít dùng cách viết này, ví dụ nên viết "Ủng hộ Vue" thay vì "Ủng Hộ Vue."
* Hạn chế dùng thể bị động vì thể này trong tiếng Việt thường nghe mất tự nhiên, mặc dù rất phổ biến trong tiếng Anh. Ví dụ để dịch "it's recommended," thay vì dịch thành "nó được khuyến khích sử dụng," hãy dịch thành "chúng tôi khuyến khích sử dụng (tên thư viện/framework)…"

## Thành viên

Phiên bản tiếng Việt được phụ trách phát triển bởi:

* [Phan An](https://github.com/phanan)
* [Nguyễn Văn Được](https://github.com/nguyenvanduocit)
* [Nguyễn Tất Thiện](https://github.com/tatthien)
* [Bùi Thanh Tùng](https://github.com/tungbt94)
* [Đậu Quang Nam](https://github.com/namdau)
* và [các thành viên khác](https://github.com/vuejs-vn/vuejs.org/graphs/contributors?from=2017-09-03)
