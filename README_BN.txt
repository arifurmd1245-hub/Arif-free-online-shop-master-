# Arif Fashion House — Free Online Shop (Starter)

এই প্যাকেজটি Arif Fashion House-এর জন্য একটি mobile-friendly free online shop-এর প্রথম version।

## কী আছে
- Men / Women / Kids category
- Product price + old price + discount
- Product Color নির্বাচন
- Product Quantity নির্বাচন
- Size নির্বাচন
- Cart
- Order Form
- Dhaka / Outside Dhaka delivery charge
- WhatsApp-এ order পাঠানোর ব্যবস্থা
- Genuine/verified review section-এর জায়গা
- Facebook Page থেকে website-এ customer পাঠানোর উপযোগী design

## প্রথমে যা পরিবর্তন করবেন
`script.js` খুলে:
1. `whatsappNumber`-এ আপনার WhatsApp নম্বর দিন (দেশের কোডসহ, + ছাড়া)
2. `products` তালিকায় আপনার আসল product name, price, size বসান
3. Product photo-এর জন্য `image`-এ ছবি ফাইলের নাম/URL দিন

## Free publishing
এই static website-টি GitHub Pages, Netlify বা অনুরূপ free static hosting-এ প্রকাশ করা যায়। Website প্রকাশের পর সেই link Facebook Page-এর button/post/ad-এ ব্যবহার করা যাবে।

## গুরুত্বপূর্ণ
এই Starter version-এ order WhatsApp-এ যায়। Customer order-এর central online database/admin panel নেই। ব্যবসা শুরু হলে পরের ধাপে Google Sheets/Forms বা অন্য free backend যুক্ত করা যাবে, যাতে মোবাইল থেকে সব order এক জায়গায় দেখা যায়।

## পরিকল্পনা
Phase 1: Free shop + WhatsApp order
Phase 2: Google Sheet order database
Phase 3: Real product photos + YouTube videos + genuine review workflow
Phase 4: নিজের domain/hosting (যদি প্রয়োজন হয়)


## নতুন Order Form সুবিধা
- Customer Order Form-এ Product photo দেখা যাবে
- প্রতিটি product-এর Color ও Size দেখা যাবে
- Quantity দেখা যাবে
- Cash on Delivery (COD)
- Personal bKash
- Personal Nagad
- bKash/Nagad হলে payment mobile number ও Transaction ID নেওয়া হবে

### আপনার payment number
`script.js`-এ `bkashNumber` এবং `nagadNumber`-এ আপনার আসল নম্বর বসাতে হবে।


## Edit Option — গুরুত্বপূর্ণ
`admin.html` হলো mobile-friendly Edit Panel।
- Product Name edit
- Category edit
- Current/Old Price edit
- Discount edit
- Product photo URL/file field
- Size edit
- Colour edit
- Stock Quantity edit
- Delivery charge edit
- WhatsApp/bKash/Nagad number edit
- Add Product
- Delete Product
- Backup Export

Free prototype-এ edit data একই browser/device-এর local storage-এ রাখা হয়। তাই এই version-এ ভুল হলে আবার Edit করে Save করা যায়। Shared online editing (যেকোনো mobile/device থেকে একই data দেখা) করতে পরের ধাপে Google Sheets বা অন্য free backend যুক্ত করতে হবে।

Development rule: নতুন feature যোগ করার সময় existing feature delete করা যাবে না।


## v6.1 নতুন উন্নয়ন
- Stock শেষ হলে অতিরিক্ত quantity order করা যাবে না
- Cart browser-এ সাময়িকভাবে সংরক্ষিত থাকবে
- bKash/Nagad নম্বর Settings থেকে dynamic হবে
- Customer review submit করতে পারবে; approval ছাড়া public হবে না
- Google Sheet backend থাকলে Admin Panel থেকে Order status ও Review approval পরিচালনা করা যাবে
