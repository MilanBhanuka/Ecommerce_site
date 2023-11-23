// price inputs

const actualPrice = document.querySelector('#actual-price');
const discountPercentage = document.querySelector('#discount');
const sellingPrice = document.querySelector('#sell-price');

discountPercentage.addEventListener('input', () => {
      if(discountPercentage.value > 100){
          discountPercentage.value = 90;
      } else{
          let discount = actualPrice.value * discountPercentage.value / 100;
          sellingPrice.value = actualPrice.value - discount;
      }
})

sellingPrice.addEventListener('input', () => {
      let discount = (sellingPrice.value / actualPrice.value) * 100;
      discountPercentage.value = discount;
})


// upload image handle
let uploadImages = document.querySelectorAll('.fileupload');
let imagePaths = []; // will store all uploaded images paths;

uploadImages.forEach((fileupload, index) => {
    fileupload.addEventListener('change', () => {
        const file = fileupload.files[0];
        let imageUrl;

        if(file.type.includes('image')){
            // means user uploaded an image
            fetch('/s3url').then(res => res.json())
                .then(url => {
                    fetch(url,{
                        method: 'PUT',
                        headers: new Headers({'Content-Type': 'multipart/form-data'}),
                        body: file
                    }).then(res => {
                        imageUrl = url.split("?")[0];
                        imagePaths[index] = imageUrl;
                        let label = document.querySelector(`label[for=${fileupload.id}]`);
                        label.style.backgroundImage = `url(${imageUrl})`;
                        let productImage = document.querySelector('.product-image');
                        productImage.style.backgroundImage = `url(${imageUrl})`;
                    })
                })

        } else{
            showAlert('upload image only');
        }
    })
})

// store size function
const storeSizes = () => {
    sizes = [];
    let sizeCheckBox = document.querySelectorAll('.size-checkbox');
    sizeCheckBox.forEach(item => {
        if(item.checked){
            sizes.push(item.value);
        }
    })
}


// form submission

const productName = document.querySelector('#product-name');
const shortLine = document.querySelector('#short-des');
const des = document.querySelector('#des');

let sizes = []; // will store all the sizes

const stock = document.querySelector('#stock');
const tags = document.querySelector('#tags');
const tac = document.querySelector('#tac');

// buttons
const addProductBtn = document.querySelector('#add-btn');
const saveDraft = document.querySelector('#save-btn');

addProductBtn.addEventListener('click', () => {
    storeSizes();
    // validate form
    const validateForm = () => {
        if(!productName.value.length){
            return showAlert('enter product name');
        } else if(shortLine.value.length > 100 || shortLine.value.length < 10){
            return showAlert('short description must be between 10 to 100 letters long');
        } else if(!des.value.length){
            return showAlert('enter detail description about the product');
        } else if(!imagePaths.length){ // image link array
            return showAlert('upload atleast one product image')
        } else if(!sizes.length){ // size array
            return showAlert('select at least one size');
        } else if(!actualPrice.value.length || !discount.value.length || !sellingPrice.value.length){
            return showAlert('you must add pricings');
        } else if(stock.value < 20){
            return showAlert('you should have at least 20 items in stock');
        } else if(!tags.value.length){
            return showAlert('enter few tags to help ranking your product in search');
        } else if(!tac.checked){
            return showAlert('you must agree to our terms and conditions');
        } 
        return true;
    }

    if(validateForm()){ // validateForm return true or false while doing validation
        loader.style.display = 'block';
        let data = productData();
        sendData('/add-product', data);
    }
})

// alert function
const showAlert = (msg) => {
    // previous code
    return false;
}

const productData = () => {
    return data = {
        name: productName.value,
        shortDes: shortLine.value,
        des: des.value,
        images: imagePaths,
        sizes: sizes,
        actualPrice: actualPrice.value,
        discount: discountPercentage.value,
        sellPrice: sellingPrice.value,
        stock: stock.value,
        tags: tags.value,
        tac: tac.checked,
        email: user.email
    }
}

//add product
app.post('/add-product', (req, res) => {
    let { name, shortDes, des, images, sizes, actualPrice, discount, sellPrice, stock, tags, tac, email } = req.body;

    
    // validation
    if(!draft){
        if(!name.length){
            return res.json({'alert': 'enter product name'});
        } else if(shortDes.length > 100 || shortDes.length < 10){
            return res.json({'alert': 'short description must be between 10 to 100 letters long'});
        } else if(!des.length){
            return res.json({'alert': 'enter detail description about the product'});
        } else if(!images.length){ // image link array
            return res.json({'alert': 'upload atleast one product image'})
        } else if(!sizes.length){ // size array
            return res.json({'alert': 'select at least one size'});
        } else if(!actualPrice.length || !discount.length || !sellPrice.length){
            return res.json({'alert': 'you must add pricings'});
        } else if(stock < 20){
            return res.json({'alert': 'you should have at least 20 items in stock'});
        } else if(!tags.length){
            return res.json({'alert': 'enter few tags to help ranking your product in search'});
        } else if(!tac){
            return res.json({'alert': 'you must agree to our terms and conditions'});
        } 
    }
    
})

