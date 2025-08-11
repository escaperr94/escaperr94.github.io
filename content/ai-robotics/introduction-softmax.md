---
title: Tôi đã hiểu nhầm em - Softmax
draft: false
date: 2024-11-07
tags:
  - Machine Learning
---

Với bất cứ ai học về Machine Learning, chắc chắn hàm số sau đã in hằn trong đầu bạn
$$
s(x_{i}) = \frac{e^{x_{i}}}{\sum_{j=1}^n e^{x_{j}}} 
$$
và hiển nhiên ta đều biết tên của nó là **Softmax**.
Hàm **Softmax** đóng vai trò chính trong việc chuyển đổi kết quả đầu ra (logit) về dạng xác suất (hình 1.1) và thường được sử dụng trong các bài toán phân loại đa lớp (Multi-Class Classification)
![[Pasted image 20241006221149.png]]
<div style="text-align: center;"><em>Hình 1.1: Một mô hình phân loại đa lớp cơ bản</em></div>


Nhưng thực sự tôi vẫn thắc mắc vkl là tại sao mọi người cứ phải dùng cái hàm chết tiệt mang tên **Softmax** này nhỉ ? Các dạng hàm khác đi mua sữa bocon hết rồi à ? Thay vì chấp nhận và dùng hàm **Softmax** như thằng wibu độc thân tuổi 20 chưa từng nắm tay gái và coi nó hiển nhiên là thứ tối ưu nhất hiện tại bởi bài báo xịn xò nào của ngành AI hiện đại cũng dùng cái hàm bỏ m* này:
- **AlexNet (2012):** Mạng sâu + GPU = win
- **VGG16 (2014):** Nhiều layers thì ngon hơn
- **Seq2seq Models (2014):** Mạng neural có thể dịch được
- **ResNet (2015):** Học cách bổ sung thông tin còn thiếu (residuals ở đây tôi cũng không biết dịch như nào cho hay)
- **DenseNet (2017):** ResNet nhưng "chad"
- **Transformer (2017):** Attention is all you need to become a chad :Đ 
... và còn nhiều bài khác

thì tôi quyết định "lọt hố" và tìm cách "vấy bẩn" cái hàm của nợ này và trên hết là trả lời được câu hỏi tại sao bài báo quái nào người ta cũng dùng con hàm này thế, công nghiệp vkl 
(*Spoiler: Tôi đã hiểu sai về em nó!*)

**Chú ý**: Để giải thích cho sự thù địch của tôi với con hàm **Softmax** mời bạn đọc phần I của bài viết, hoặc nếu bạn không thích có thể skip và đọc luôn phần II nếu chỉ muốn hiểu tại sao các mô hình AI hiện nay đều sử dụng con hàm này. 
## Sự thù địch của tôi với con hàm $e^x$
### Một nửa lý do (hoàn toàn khách quan và không hề có tư thù cá nhân)
Tôi vốn là đứa khá thích Toán (dù trình Toán như loèn), thứ tôi thích ở nó là sự phức tạp, khó hiểu nhưng ẩn đằng sau là nét tinh tế, đẹp đẽ của những khuôn mẫu tự nhiên. Với tôi, toán học là ngôn ngữ của Chúa, là cây cầu kết nối ta với vẻ đẹp kỹ vĩ của thiên nhiên, tạo hóa; phản ánh sự thay đổi, kết cấu siêu hình của vũ trụ, ... nhưng trong vẻ đẹp đầy tráng lệ ấy lòi ra con hàm $e^x$.
Bạn không tin là nó dở người vãi đái ư, vậy để tôi chứng minh cho bạn thấy với bài thơ sau

>*Có một hàm số trong toán cung,*  
>*Tên là $e^x$, nổi vô cùng.*  
>*Đứng giữa muôn hàm, nó cao ngạo,*  
>*Vì tự đạo hàm, chẳng mất công.*
>
>*Hàm bậc nhất than: "Ta đơn sơ,*  
>*Nhưng ta dễ hiểu, dễ nên thơ."*  
>*$e^x$ cười khẩy, flex bất ngờ:*  
>*"Ta tăng nhanh lắm, chẳng dừng chờ."*
>
>*Đa thức lên tiếng: "Ta có căn,*  
>*Giải phương trình khó, ta giúp phần."*  
>*$e^x$ bĩu môi cười chê trách:*  
>*"Căn làm chi, ta đâu có cần!"*
>
>*Sin với Cosine nhẹ nhàng reo:*  
>*"Chúng ta là sóng, nhịp mãi theo."*  
>*$e^x$ kiêu căng: "Các ngươi nhớ,*  
>*Ta gắn Euler, nên ta trèo."*
>
>*Cuối cùng, mọi hàm thở dài than,*  
>*$e^x$ sao lười, chẳng biến toàn,*  
>*Mãi là chính nó, không đổi khác,*  
>*Tự đạo hàm xong, tự huy hoàng.*

\- escaperr

Bản chất của tự nhiên luôn thay đổi nhưng cái hàm kiêu ngạo của nợ này nó del chịu thay đổi tí nào cả, chưa kể tại vì cái hàm chết tiệt này mà trong kỳ thi THPTQG tôi sai ngu m* mất 1 câu vì bấm nhầm $e^x$ thành $2^x$ (Cũng không trách tôi được vì tôi là dân châu Á bấm A rồi cùng lắm là B chứ tự nhiên bảo bấm vào $e$ thường thì thật là có lỗi với tổ tiên).

Còn gì tệ hàm một hàm $e^x$ ngoài một hàm cấu tạo bởi nhiều hàm dạng $e^x$ - Vâng đó chính là lý do tôi ghét **Softmax** vaidai.
### Nửa còn lại ...
$e^x$ thực sự là một hàm không mấy "thân thiện" với máy tính và cực kỳ dễ tràn số. Thật vậy, bạn hãy thử đoạn code sau
```python
torch.exp(torch.Tensor([100.0]))
```
Bạn đoán xem kết quả trả về là gì
```python
tensor([inf]) 💀💀💀
```
Việc tính $e^{x}$ trên máy tính là cực kỳ tốn kém vì máy tính chỉ có thể ước lượng nó một cách xấp xỉ thông thường nhất là thông qua khai triển Taylor (1), xấp xỉ Pade hoặc CORDIC. 
$$
e^x = 1 + x + \frac{x^2}{2!} + \frac{x^3}{3!} + \dots \hspace{5cm} (1)
$$
Và đến đây chắc bạn cũng nhận ra số lần phải tính $e^x$ của cái hàm **Softmax** rồi nhỉ 😵 .

Ngoài ra, rõ ràng nếu vai trò của lớp **Softmax** là chuyển *logit* thành *xác suất* thì ta hoàn toàn có thể sử dụng các dạng hàm khác miễn đấy là hàm dương, đơn điệu và khả vi thì đều được. Vậy vì sao **Softmax** lại chọn sử dụng $e^x$ sau một đống lý do bất lợi tôi nói ở trên cũng như vì sao việc sử dụng $\sum$ lại hiệu quả và đúng về mặt toán học. 

Sau mấy hôm ngồi tìm tòi, xem YouTube, đọc blog chỗ này chỗ kia thay vì làm bài trên lớp thì cuối cùng tôi cũng tìm ra lý do đủ thỏa đáng để trả lời thắc mắc vớ vẩn trên, không dài dòng nữa ta cùng bắt đầu vào phần chính.

## Vì sao hàm Softmax lại được sử dụng ?
### Vì sao dùng $\frac{u(a)}{\sum_{a'\in A}u(a')}$
Do tôi vẫn khá kỳ thị con hàm $e^x$ nên tôi sẽ bắt đầu với lý do vì sao việc **Softmax** mô hình hóa dưới dạng 
$$
\frac{u(a)}{\sum_{a'\in A}u(a')}
$$
lại đúng đắn về mặt toán học và mô tả được quan hệ xác suất cần thiết.

Trước hết, ta cần thừa nhận trong các lớp bài toán phân loại đa lớp mà ta hay làm việc, tỷ lệ xác suất giữa 2 lớp $i$ và $j$ sẽ không bị ảnh hưởng bởi sự xuất hiện hay biến mất của các lớp khác; ví dụ như lớp $k$ nào đấy. Có vẻ vẫn hơi khó hiểu, ta đi vào chi tiết hơn với một bài toán cụ thể như sau: Giả sử ta có bài toán phân loại ảnh vào 5 class 
$Chó$, $Mèo$, $Gà$, $Lợn$, $Bò$, ta giả định việc xác định một ảnh là $Chó$ hay $Mèo$ không bị ảnh hưởng bởi sự có mặt của các class còn lại (rõ ràng việc giả định như này là hợp lý vì việc quyết định 1 ảnh là Chó hay Mèo hoàn toàn không liên quan tới sự xuất hiện của các class khác) nên khi viết dưới dạng toán học ta cần một mô hình mô tả
$$
\frac{P(Chó)}{P(Mèo)} = const
$$
bất kể có sự hiện diện của các class khác hay không. Việc chấp thuận giả định trên cũng chính là ta đang thừa nhận **Luce's choice axiom** hay nguyên lý **"Independence from Irrelevant Alternatives" (IIA)** - cho rằng sự lựa chọn giữa hai đối tượng không bị ảnh hưởng bởi sự có mặt của các đối tượng khác trong tập lựa chọn (đó cũng chính là lý do vì sao $\frac{P(Chó)}{P(Mèo)}= const$ bất kể xuất hiện Gà, Lợn, Bò hay không)

---

>**Luce's choice axiom:** Consider a set $X$ of possible outcomes, and consider a selection rule $P$, such that for any $a \in A \subset X$ with $A$ a finite set, the selector $a$ from $A$ with probability $P(a|A)$
>
>*Axiom 1*: If $P(a|A) = 0, \hspace{0.2cm} P(b|A) >0,$ then for any $a, b\in B \subset A,$ we still have $P(a|B) = 0$
> 
>*Axiom 2*: $P(a|A) = P(a|B)\sum_{b\in B}P(b|A)$ for any $a \in B \subset A$

---

<div style="text-align: center;"><em>"Tôi sẽ không đi vào chi tiết hơn về các phần chứng minh toán, mà sẽ chỉ để định nghĩa tiên đề ở đây để các bạn tham khảo, trong bài này bạn chỉ cần nắm được rằng tiên đề trên thể hiện sự lựa chọn giữa hai đối tượng không bị ảnh hưởng bởi sự có mặt của các đối tượng khác trong tập lựa chọn"</em></div>

Về mặt toán học người ta cũng chứng minh được rằng với *matching law* $P(a|A) = \frac{u(a)} {\sum_{a'\in A}u(a')}$ thỏa mãn **Luce's choice axiom** như vậy có thể thấy hàm **Softmax** thỏa mãn tiên đề trên. 

Quay lại bài toán phân loại ảnh đã nói ở trên, giả sử ở lớp *logits* ta không xét đến sự hiện diện của Gà, Lợn Bò và ta có:
- Chó: 8 
- Mèo: 6 

Mô hình hóa dưới dạng xác suất bằng $\frac{u(a)}{\sum_{a'\in A}u(a')}$ ta thu được:
- $P(Chó) = \frac{8}{6+8} = \frac{4}{7}$
- $P(Mèo) = \frac{6}{8+6} = \frac{3}{7}$

từ đây ta thu được tỉ số 
$$
\frac{P(Chó)}{P(Mèo)} = \frac{4}{3}
$$
Ta bổ sung thêm các giá trị của Gà, Lợn, Bò vào mô hình:
- Chó: 8
- Mèo: 6
- Gà: 4
- Lợn: 5
- Bò: 9

Lúc này tiếp tục mô hình hóa dưới dạng xác suất ta thu được:
- $P(Chó) = \frac{8}{8+6+4+5+9} = \frac{1}{4}$
- $P(Mèo) = \frac{6}{8+6+4+5+9} = \frac{3}{16}$

tiếp tục tính thử cặp tỉ số $\frac{P(Chó)}{P(Mèo)}$ ta nhận ra giá trị cặp tỉ số này không đổi
$$
\frac{P(Chó)}{P(Mèo)}=\frac{4}{3}
$$

Như vậy dạng $\frac{u(a)}{\sum_{a'\in A}u(a')}$ giúp đảm bảo việc lựa chọn (tỉ số xác suất) giữa hai đối tượng trong không gian mẫu là không đổi bất kể có sự có mặt của các đối tượng khác trong tập lựa chọn hay không.

Đến đây, ta lại đặt ra một câu hỏi khác: Vậy nếu ta muốn mô hình hóa lớp bài toán mà ở đó việc lựa chọn giữa hai đối tượng bất kỳ thay đổi với sự có mặt của các đối tượng khác thì làm như nào ? Ví dụ ta có bài toán **Image tagging** với 3 đối tượng: $Beach, Sunset, Ocean$ rõ ràng sự có mặt của $Ocean$ tăng *likelihood* (khả năng xảy ra) của $Beach$ và từ đó làm thay đổi tỉ số giữa $\frac{P(Beach)}{P(Sunset)}$. Với lớp bài toán này người ta sử dụng dạng hàm **Hierarchical Softmax** mà tôi sẽ nói tới trong những bài tiếp theo khi dùng hàm này để tối ưu cho mô hình **Word2Vec**.

### Vì sao lại dùng $e^x$
Pheww... cuối cùng cũng tới lý do phải dùng tới hàm của nợ này. Trước hết trong các bài toán Học máy nói chung mục tiêu của ta là phải tôi ưu một hàm loss kiểu $L(y, f(s))$. Xét một bài toán phân loại đa lớp, $y$ là one-hot vector của các class còn $f(s)$ là đầu ra của hàm **Softmax** ($\sigma(s))$ với $s$ là *logits*.
Để tối ưu hàm trên thông thường ta sẽ phải tính gradient 
$$
\frac{ \partial L(y, f(s)) }{ \partial s } = \left[ \frac{ \partial f(s) }{ \partial s }\right]^T \frac{ \partial L(y, f(s)) }{ \partial f(s) }  \hspace{1cm} (\text{chain rule}) (2)
$$
Có thể thấy trong các bài toán phân lớp, người ta cũng thường chọn hàm mất mát $L(y, f(s)) = -y^T\log(f(s))$ (Negative Log-likelihood); việc chọn này có ý nghĩa vô cùng quan trọng vì với việc giới thiệu hàm $\log$ vào đây ta đã biến đổi được hàm **Softmax** từ dạng đa thức về dạng trông "*tuyến tính*" hơn
$$
\begin{align*}
L(y, f(s)) &= -y^T\log \frac{e^s}{\sum_{c}e^{s_{c}}} \\
&=-y^T\left( s - \log \sum_{c}e^{s_{c}} \right)
\end{align*}
$$
Ngoài ra khi tính gradient thì ta có:
$$
\begin{align*}
\frac{ \partial f(s) }{ \partial s } &=  \frac{ \partial \sigma(s) }{ \partial s }  \\
&=diag(\sigma(s)) - \sigma(s)\sigma(s)^T \hspace{1cm} (3)
\end{align*}
$$
(3) trả về một ma trận đối xứng với tổng của từng hàng bằng 0 (và đương nhiên vì đối xứng nên tổng các cột cũng bằng 0); đây là một tính chất rất hay vì nó cho phép ta thực hiện trừ đi gradient (VD dùng thuật toán Gradient Descent) để cập nhật tham số mà vẫn bảo toàn tính chất tổng đầu ra bằng 1 của một xác suất.  (Bạn cứ tính thử ra là biết)

Không chỉ dừng lại ở đó, việc tính $\frac{ \partial L(y, f(s)) }{ \partial f(s) }$ với việc chọn negative-log likelihood còn trở nên cực kỳ dễ dàng
$$
\begin{align*}
\frac{ \partial L(y, f(s)) }{ \partial f(s) } &= -\frac{y}{\sigma(s)} \hspace{1cm}(4)
\end{align*}
$$
Từ (3) và (4), ta thu được 
$$
\begin{align*}
\frac{ \partial L(y, f(s)) }{ \partial s } &= \left[ \frac{ \partial f(s) }{ \partial s }\right]^T \frac{ \partial L(y, f(s)) }{ \partial f(s) } \\
&= (diag(\sigma(s)) - \sigma(s)\sigma(s)^T) \frac{-y}{\sigma(s)} \\
&= \sigma(s) - y \hspace{2.3cm} (5)
\end{align*}
$$
<b style="color: red">THẬT SỰ QUÁ ẢO MA</b>, ta đã chuyển từ việc phải tính phép nhân của 2 ma trận với nhau trong biểu thức (3) thành việc tính phép trừ của duy nhất 2 vector bằng việc chọn hàm loss và sử dụng **Softmax** và đây chính là lý do vì sao **Softmax** lại được sử dụng nhiều đến vậy. Trên thực tế khi chúng ta gọi hàm 
```python
nn.CrossEntropyLoss
```
trong thư viện Pytorch, thì biếu thức trên chính xác là cách mà hàm này tính toán. Thực sự tôi đã hiểu lầm em - **Softmax** tôi xin lỗi, tôi sai rồi.

**Tái bút:** Nhưng tôi vẫn ghét con hàm $e^x$ vkl nhé !

## References
[Why Do Neural Networks Love the Softmax? (youtube.com)](https://www.youtube.com/watch?v=p-6wUOXaVqs)

[Softmax with cross-entropy (mattpetersen.github.io)](https://mattpetersen.github.io/softmax-with-cross-entropy)

[Understanding softmax and the negative log-likelihood (ljvmiranda921.github.io)](https://ljvmiranda921.github.io/notebook/2017/08/13/softmax-and-the-negative-log-likelihood/)

[Luce's choice axiom - Wikipedia](https://en.wikipedia.org/wiki/Luce%27s_choice_axiom)
