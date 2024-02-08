import { initializeApp } from "https://www.gstatic.com/firebasejs/10.5.2/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.5.2/firebase-analytics.js";
import { getStorage, ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.5.2/firebase-storage.js"; // Import Firebase Storage

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyCv2koOkHrqG_ioHoOU1vuDfI2KPwLNTZM",
    authDomain: "revise-480317.firebaseapp.com",
    projectId: "revise-480317",
    storageBucket: "revise-480317.appspot.com",
    messagingSenderId: "264373202075",
    appId: "1:264373202075:web:faca853c3021e78db36a3e",
    measurementId: "G-2VNZKXQP1Q",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
//firebase.initializeApp(firebaseConfig);
//database = firebase.database();
// Get a reference to the Firebase Storage
const storage = getStorage(app);

//export function uploadImage() {
export function uploadImage() {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = (e) => {
        const file = e.target.files[0];
        popupAlert("Image is loading...", true);
        setTimeout(function () {
            removePopupAlert();
        }, 10000);

        //interval_save_image = setInterval(saveImage, 1000);
        if (file) {
            const storageRef = ref(storage, `images/${file.name}`);
            const uploadTask = uploadBytes(storageRef, file);

            uploadTask
                .then(() => {
                    // Upload completed successfully, get the download URL
                    getDownloadURL(storageRef)
                        .then((downloadURL) => {
                            console.log("Image uploaded. URL: " + downloadURL);
                            image_url = downloadURL;
                            return downloadURL;
                        })
                        .catch((error) => {
                            console.error("Error getting download URL:", error);
                        });
                })
                .catch((error) => {
                    console.error("Error uploading image:", error);
                });
        }
    };

    input.click();
}

/// IMPORT

async function getImageURL() {
    var url = uploadImage();
}
var interval_save_image;
var image_url = "";
function saveImage() {
    function saveImage(url) {
        if (image_url != "") {
            image_url = "";
            clearInterval(interval_save_image);
        }
    }
}

function popupAlert(message, time) {
    var div = document.createElement("div");
    div.className = "me-popup-alert";
    div.textContent = message;
    document.body.append(div);
    if (time) return;
    setTimeout(function () {
        div.remove();
    }, 3000);
}
function removePopupAlert() {
    var x = document.querySelector(".me-popup-alert");
    if (x) x.remove();
}

var roam_data_array_me = {};

// GENERAL FUNCTIONS

var pages_data = {
    pages: [],
    pages_uids: ["45wa3CZDL", "Alzo0EndR", "LAEEjXYjj", "i79c2YbFP", "JouaVMoNk", "RHSilXmxZ", "_uv1EcKrq", "n-mRjNHJc", "KVxWPdfig", "oN0leRcwi", "YLR5l5b0P", "Jnx3BAl0X", "6uc2KFOxm", "nVfU4H9oU", "OdBtk_0_N", "VxWjCsGZK", "OcBMVMl-O", "ka2wVm3wk", "f_EAOKVWb", "qogdicLKZ", "p8pevyGPr", "zCQqARSEK", "MtaDf5vOD", "If9hHx2x7", "pTu4Vbd8Y"],
};

var student_data_array_me = {
    questions: [],
    images: [],
    user_name: "",
};
var all_tags = []; // ["polity", "economy", "biology"];
var filter_tags = [];
var filter_questions = [];
var fil_que;
var curr_que_index;
var curr_que;

async function initialLoading() {
    //get pages data from git
    var filename = "neet_roam_data_pages.json";
    var id = "53593a25b5bc8b0ca8046ff2bfc08eb9";
    var data = await getDataFromGit(id, filename);
    if (data) {
        pages_data = data;
    }

    console.log("me: pages data loaded: Pages:" + pages_data.pages_uids.length);
    //get question data from git

    var filename = "neet_roam_data_questions.json";
    var id = "ac87508b4fe688abef61649f9674fabb";
    data = await getDataFromGit(id, filename);
    if (data) {
        roam_data_array_me = data;
    }
    console.log("me: pages and question data loaded");

    if (window.innerWidth < 700) {
        document.body.classList.add("mobile");
    } else {
        document.body.classList.remove("mobile");
    }
    // load student_data
    getStudentData();
    if (!student_data_array_me.questions) student_data_array_me.questions = [];
    if (!student_data_array_me.images) student_data_array_me.images = [];
    console.log("me: student data from locale retrieved");
    // load all tags
    roam_data_array_me.questions.forEach((que) => {
        if (!que.tags) {
            que.tags = [];
        }
        if (que.public) filter_questions.push(que);
        que.tags.forEach((tag) => {
            if (!all_tags.includes(tag)) all_tags.push(tag);
        });
        if (que.page_uid && que.page_uid != "") {
            var page_title = getPageTitle(que.page_uid);
            if (!all_tags.includes(page_title)) all_tags.push(page_title);
        }
        console.log("me: All tags loaded");
    });
    console.log("me: all tags loaded");

    filter_questions = [];
    roam_data_array_me.questions.forEach((que) => {
        if (que.page_uid && que.page_uid == "Alzo0EndR") filter_questions.push(que);
    });
    curr_que = filter_questions[0];
    curr_que_index = 10;
    showQuestion();

    var app_logo = document.querySelector(".app-logo");
    app_logo.addEventListener("click", (event) => {
        displayInMainPage("home");
    });

    var network_icon = document.querySelector("i.que-sec-icon");
    network_icon.addEventListener("click", (event) => {
        var ques_sec = document.querySelector(".practice-que-sec");
        if (ques_sec.classList.contains("hide")) {
            displayInMainPage("questions");
        } else {
            displayInMainPage("me-page");
        }
    });
    console.log("me: initial loading is completed");
    setEventListnersForQuestionSection();
    loadInHomePage();
}
initialLoading();

function setEventListnersForQuestionSection() {
    var toc_icon = document.querySelector(".head .toc-icon");
    toc_icon.addEventListener("click", getTableOfContentForCurrentPage);

    var image_icon = document.querySelector(".head .image-icon");
    image_icon.addEventListener("click", () => {
        var d = document.querySelector(".all-images .all-images-list");
        if (!d.innerHTML) showAllImageNotes();
        displayInMainPage("all-images");
    });

    var filter_tag_input = document.querySelector(".practice-que-sec .filter-sec input ");
    filter_tag_input.addEventListener("focus", (event) => {
        setAutoComplete(event, all_tags, "que-filter-tags");
    });

    document.querySelector(".all-images .refresh-icon").addEventListener("click", () => {
        var d = document.querySelector(".all-images .all-images-list");
        d.innerHTML = "";
        showAllImageNotes();
        displayInMainPage("all-images");
    });
}

function getTableOfContentForCurrentPage() {
    var page_uid = document.querySelector(".me-page-title").id;
    var blocks = getPageBlocks(page_uid);

    var div = getTableOfContentHtmlTemplate();
    var toC = div.querySelector(".list");
    div.querySelector(".cross-icon").addEventListener("click", () => {
        div.remove();
    });
    var level = 0;
    blocks.forEach((block) => {
        toC = iterateThroughBlocks(block, level, toC);
    });
    //div.querySelector(".list").replaceWith(toC);
    return div;
}

function iterateThroughBlocks(block, level, div) {
    var string = block.string;
    if (string.indexOf("#.me-heading") != -1) {
        var span = document.createElement("span");
        span.id = block.uid;
        string = string.substring(0, string.indexOf("#.me-"));
        span.textContent = string;
        span.className = `toc l${level} me-link`;
        div.appendChild(span);
        span.addEventListener("click", (event) => {
            var div = document.querySelector(`div[id="${block.uid}"]`);
            if (div) div.scrollIntoView({ behavior: "smooth" });
        });
    }
    var children = block.children;
    if (children) {
        ++level;
        children.forEach((child) => {
            div = iterateThroughBlocks(child, level, div);
        });
    }
    return div;
}

function getTableOfContentHtmlTemplate() {
    var div = document.createElement("div");
    div.className = "table-of-content-section";
    div.innerHTML = `
    <div class="table-of-content me-d-flex-c">
        <div class="top me-d-flex">
            <span class="me-label">Content List</span>
            <i class="fa-regular fa-xmark cross-icon me-mla"></i>
        </div>
        <div class="list me-d-flex-c">
            
        </div>
    </div>
    `;
    document.querySelector(".me-page").append(div);
    return div;
}
function getPageBlocks(uid) {
    var pages = pages_data.pages;
    for (var i = 0; i < pages.length; i++) {
        if (pages[i].uid == uid) return pages[i].blocks;
    }
    return null;
}

function loadInHomePage() {
    loadAllNCERTChapters();
    loadAllPYQs();
    loadchapterWiseMCQs();
    loadAboutMe();
}
function loadAllNCERTChapters() {
    var div = document.createElement("div");
    div.className = "ncert-chapters section";
    document.querySelector(".home-page").appendChild(div);

    div.innerHTML = `
        <div class="head">
            <i class="fa-light fa-book book-icon icon"></i>
            <span class="text">Biology Chapters</span>
            <i class="fa-regular fa-angle-down down-icon arrow-icon me-mla"></i>
        </div>
        <div class="chapter-list items hide"></div>
    `;
    div.children[0].addEventListener("click", () => {
        //div.children[1].classList.toggle("hide");
        var items = div.children[1];
        items.classList.toggle("hide");
        var head_icon = div.querySelector(".head .arrow-icon");
        if (items.classList.contains("hide")) {
            head_icon.className = "fa-regular fa-angle-down down-icon arrow-icon me-mla";
        } else {
            head_icon.className = "fa-regular fa-angle-up down-icon arrow-icon me-mla";
        }
    });
    pages_data.pages.forEach((page) => {
        var span = document.createElement("span");
        span.className = "chapter-name chapter item";
        span.id = page.uid;
        span.textContent = page.title;
        div.children[1].appendChild(span);
        span.addEventListener("click", () => {
            var x = div.querySelector(".active");
            if (x) x.classList.remove("active");
            span.classList.add("active");
            var x = openRoamPage(page.uid);

            if (x) return;
            var x = document.querySelector(".me-page .me-page-title");
            x.scrollIntoView({ behavior: "smooth" });
        });
    });
}

function loadAllPYQs() {
    var div = document.createElement("div");
    div.className = "pyqs section";
    document.querySelector(".home-page").appendChild(div);

    div.innerHTML = `
        <div class="head">
            <i class="fa-regular fa-seal-question que-icon icon"></i>
            <span class="text">Biology PYQs</span>
            <i class="fa-regular fa-angle-down down-icon arrow-icon me-mla"></i>
        </div>
        <div class="pyq-list items hide"></div>
    `;
    div.children[0].addEventListener("click", () => {
        //div.children[1].classList.toggle("hide");
        var items = div.children[1];
        items.classList.toggle("hide");
        var head_icon = div.querySelector(".head .arrow-icon");
        if (items.classList.contains("hide")) {
            head_icon.className = "fa-regular fa-angle-down down-icon arrow-icon me-mla";
        } else {
            head_icon.className = "fa-regular fa-angle-up down-icon arrow-icon me-mla";
        }
    });
    var years = [];
    roam_data_array_me.questions.forEach((que) => {
        if (que.year && que.year != "" && !years.includes(que.year)) {
            years.push(que.year);
        }
    });
    years[0] = 2018;
    years.sort((a, b) => a - b);

    years.forEach((year) => {
        var span = document.createElement("span");
        span.className = "pyq-year item";
        span.id = "";
        span.textContent = `NEET ${year} PYQs`;
        div.children[1].appendChild(span);
        span.addEventListener("click", () => {
            var x = div.querySelector(".active");
            if (x) x.classList.remove("active");
            span.classList.add("active");

            openPYQs(year);
        });
    });
}
function openPYQs(year) {
    var page = document.querySelector(".me-page");
    page.innerHTML = "";
    var all_ques = [];
    roam_data_array_me.questions.forEach((que) => {
        if (que.year && que.year == year) all_ques.push(que);
    });
    all_ques = sortArrayRandomly(all_ques);
    var span = document.createElement("span");
    span.className = "mcq-page-title";
    span.textContent = `NEET ${year} PYQs`;
    page.appendChild(span);

    all_ques.forEach((que) => {
        var div = document.createElement("div");
        div.className = "mcq me-mcq-block";
        div.id = que.id;
        page.appendChild(div);

        var span = document.createElement("span");
        span.className = "que-text";
        span.innerHTML = convertTextToHTML(que.question_text);
        div.appendChild(span);

        var d = getMCQOptionsTemplate(que);
        d.querySelector(".pyq-year").remove();
        div.appendChild(d);
    });

    displayInMainPage("me-page");
}

function loadchapterWiseMCQs() {
    var div = document.createElement("div");
    div.className = "chapter-mcqs section";
    document.querySelector(".home-page").appendChild(div);

    div.innerHTML = `
        <div class="head">
            <i class="fa-regular fa-seal-question que-icon icon"></i>
            <span class="text">Chapter Wise MCQs</span>
            <i class="fa-regular fa-angle-down down-icon arrow-icon me-mla"></i>
        </div>
        <div class="cw-mcq-list items hide"></div>
    `;
    div.children[0].addEventListener("click", () => {
        var items = div.children[1];
        items.classList.toggle("hide");
        var head_icon = div.querySelector(".head .arrow-icon");
        if (items.classList.contains("hide")) {
            head_icon.className = "fa-regular fa-angle-down down-icon arrow-icon me-mla";
        } else {
            head_icon.className = "fa-regular fa-angle-up down-icon arrow-icon me-mla";
        }
    });
    var pages_uids = [];
    roam_data_array_me.questions.forEach((que) => {
        if (que.page_uid && que.page_uid != "" && !pages_uids.includes(que.page_uid)) {
            pages_uids.push(que.page_uid);
        }
    });

    //years[0] = 2018;
    //years.sort((a, b) => a - b);

    pages_uids.forEach((pages_uid) => {
        var title = getPageTitle(pages_uid);
        var span = document.createElement("span");
        span.className = "cw-mcq item";
        span.id = pages_uid;
        span.textContent = title;
        div.children[1].appendChild(span);
        span.addEventListener("click", () => {
            var x = div.querySelector(".active");
            if (x) x.classList.remove("active");
            span.classList.add("active");

            openChapterMCQs(pages_uid);
        });
    });
}

function openChapterMCQs(page_uid) {
    var page = document.querySelector(".me-page");
    page.innerHTML = "";
    var all_ques = [];
    roam_data_array_me.questions.forEach((que) => {
        if (que.page_uid && que.type != "normal" && que.page_uid == page_uid) all_ques.push(que);
    });
    all_ques = sortArrayRandomly(all_ques);
    var span = document.createElement("span");
    span.className = "mcq-page-title";
    span.textContent = "MCQs on " + getPageTitle(page_uid);
    page.appendChild(span);

    all_ques.forEach((que) => {
        var div = document.createElement("div");
        div.className = "mcq me-mcq-block";
        div.id = que.id;
        page.appendChild(div);

        var span = document.createElement("span");
        span.className = "que-text";
        span.innerHTML = convertTextToHTML(que.question_text);
        div.appendChild(span);

        var d = getMCQOptionsTemplate(que);
        var x = d.querySelector(".pyq-year");
        if (x) x.remove();
        div.appendChild(d);
    });

    displayInMainPage("me-page");
}

function loadAboutMe() {
    var div = document.createElement("div");
    div.className = "about-me section";
    document.querySelector(".home-page").appendChild(div);

    div.innerHTML = `
        <div class="head">
            <i class="fa-regular fa-person person-icon icon"></i>
            <span class="text">About Me</span>
            <i class="fa-regular fa-angle-down down-icon arrow-icon me-mla"></i>
        </div>
        <div class="about-me items hide"></div>
    `;
    div.children[0].addEventListener("click", () => {
        //div.children[1].classList.toggle("hide");
        var items = div.children[1];
        items.classList.toggle("hide");
        var head_icon = div.querySelector(".head .arrow-icon");
        if (items.classList.contains("hide")) {
            head_icon.className = "fa-regular fa-angle-down down-icon arrow-icon me-mla";
        } else {
            head_icon.className = "fa-regular fa-angle-up down-icon arrow-icon me-mla";
        }
    });
    div.children[1].innerHTML = `
    
    <img src="./assets/me.jpg" alt="" />
    <span class="name">Mehboob Elahi</span>
    <div class="social-media-links">
        <a href="https://facebook.com/mehboobelahi05" target="_blank" class="icon facebook"> <img src="./assets/facebook.png" /> </a>
        <a href="https://instagram.com/mehboobelahi05" target="_blank" class="icon x"><img src="./assets/instagram.png" /></a>
        <a href="https://twitter.com/mehboobelahi05" target="_blank" class="icon x"><img src="./assets/twitter.png" /></a>
        <a href="https://www.youtube.com/@mehboobelahi05/featured" target="_blank" class="icon youtube"><img src="./assets/youtube.png" /></a>
    </div>
    <span class="text"> Any website level changes are going to update in the app automatically
We don't charge monthly or yearly. We charge per build.
App build is not required if you make any changes in your website. App will always be synced with website. Build is required if you want to make change in the app icon , launch screen and all. </span>
    `;
}

function getAboutMeHTMLTemplate() {
    return `
     <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css" />
    <div class="image">
        <img src="./assets/me.jpg" alt="" />
    </div>
    <span cla>Mehboob Elahi</span>
    <div class="row social-media">
        <a href="https://facebook.com/mehboobelahi05" target="_blank" class="icon facebook"> <img src="./assets/facebook.png" /> </a>
        <a href="https://instagram.com/mehboobelahi05" target="_blank" class="icon x"><img src="./assets/instagram.png" /></a>
        <a href="https://twitter.com/mehboobelahi05" target="_blank" class="icon x"><img src="./assets/twitter.png" /></a>
        <a href="https://www.youtube.com/@mehboobelahi05/featured" target="_blank" class="icon youtube"><img src="./assets/youtube.png" /></a>
    </div>

    <div class="text">
        <span class="text"> Any website level changes are going to update in the app automatically
We don't charge monthly or yearly. We charge per build.
App build is not required if you make any changes in your website. App will always be synced with website. Build is required if you want to make change in the app icon , launch screen and all.</span>
    </div>`;
}

var autocompleteList = document.createElement("div");
autocompleteList.className = "me-autocomplete-list";
document.body.append(autocompleteList);

function setAutoComplete(event, arr, type, target) {
    var input = event.target;

    input.addEventListener("input", function () {
        var inputValue = input.value.trim().toLowerCase();
        const matchingNames = [];
        try {
            matchingNames = arr.filter((name) => name.toLowerCase().includes(inputValue));
        } catch (e) {}

        autocompleteList.innerHTML = "";

        if (false && inputValue !== "") {
            const inputItem = document.createElement("div");
            inputItem.textContent = 'new: "' + inputValue + '"';

            inputItem.addEventListener("click", (event) => {
                // Add your logic here for handling the click event of the input value
                var tar = input.parentElement;
                var tag = event.target.textContent.match(/"([^"]*)"/)[1].trim();
                if ((type = "me-add-que-tags")) {
                    handleNewQuestionTags(input, tag);
                }
                input.value = "";
                input.focus();
                autocompleteList.classList.remove("active");
                return;

                var div = document.createElement("div");
                div.className = "tag";
                div.innerHTML = `<span class="name">${tag}</span>
                 <span class="remove-tag">x</span>`;
                tar.insertBefore(div, input);
                div.children[1].addEventListener("click", (event) => {
                    div.remove();
                });
            });

            autocompleteList.appendChild(inputItem);
        }

        matchingNames.forEach((name) => {
            const item = document.createElement("div");
            item.textContent = name;

            item.addEventListener("click", (event) => {
                var tar = input.parentElement;
                var tag = event.target.textContent.trim();
                if (type == "que-filter-tags") {
                    handleFilterTag(input, tag);
                } else if (type == "link-search") {
                    handleSelectedSearchLink(input, tag);
                } else if ((type = "me-add-que-tags")) {
                    handleNewQuestionTags(input, tag);
                } else {
                    var div = document.createElement("div");
                    div.className = "tag";
                    div.innerHTML = `<span class="name">${tag}</span>
                     <span class="remove-tag">x</span>`;
                    tar.insertBefore(div, input);
                    div.children[1].addEventListener("click", (event) => {
                        div.remove();
                    });
                    input.value = "";
                    input.focus();
                }
                autocompleteList.classList.remove("active");
            });

            autocompleteList.appendChild(item);
        });

        if (matchingNames.length > 0 || inputValue !== "") {
            autocompleteList.classList.add("active");
        } else {
            autocompleteList.classList.remove("active");
        }

        var inputRect = input.getBoundingClientRect();
        autocompleteList.style.width = inputRect.width + "px";
        autocompleteList.style.top = inputRect.bottom + window.scrollY + "px";
        autocompleteList.style.left = inputRect.left + window.scrollX + "px";
        if (input.classList.contains("filter-tag")) autocompleteList.style.width = "300px";
    });

    window.addEventListener("mousedown", function (event) {
        if (!input.contains(event.target) && !autocompleteList.contains(event.target)) {
            autocompleteList.classList.remove("active");
        }
    });
}
function handleFilterTag(input, tag) {
    if (!filter_tags) filter_tags = [];
    if (filter_tags.includes(tag)) return;

    var tag_element = getTagElement(tag); // tag string --> tag element
    var target = input.parentElement.querySelector(".tags");

    tag_element.children[1].addEventListener("click", (event) => {
        tag_element.remove();
        updateFilterQuestions(target);
    });
    target.appendChild(tag_element);

    //updateFilterQuestions(input, tag);
    updateFilterQuestions(target);
    input.value = "";
    input.focus();
}

function updateFilterQuestions(target) {
    filter_tags = [];
    target.querySelectorAll(".name").forEach((tag_name_element) => {
        tag_name = tag_name_element.textContent;
        filter_tags.push(tag_name);
    });
    if (filter_tags.length != 0) {
        filter_questions = getFilteredQuestions(filter_tags);
    } else {
        //filter_questions = roam_data_array_me.questions;
    }

    curr_que_index = 0;
    showQuestion();
}
function getFilteredQuestions(tags) {
    var arr = [];
    var temp = roam_data_array_me.questions;
    tags.forEach((tag) => {
        temp.forEach((que) => {
            if (que.tags.includes(tag)) arr.push(que);
        });
        temp = arr;
    });
    return arr;
}

function openRoamPage(page_uid) {
    var x = document.querySelector(".me-page-title");
    if (x && x.id == page_uid) {
        displayInMainPage("me-page");
        return "same";
    }

    var page = "";
    var pages = pages_data.pages;
    for (var i = 0; i < pages.length; i++) {
        if (pages[i].uid == page_uid) {
            page = pages[i];
            break;
        }
    }
    var me_page = document.querySelector(".me-page");
    me_page.innerHTML = "";

    var span = document.createElement("span");
    span.className = "me-page-title";
    span.id = page.uid;
    span.textContent = page.title;
    me_page.appendChild(span);

    page.blocks.forEach((block) => {
        addPageBlocks(block, me_page);
    });
    displayInMainPage("me-page");
    return null;
}
function addPageBlocks(block, target) {
    var div = document.createElement("div");
    div.className = "me-block";
    target.appendChild(div);

    var div_main = document.createElement("div");
    div_main.className = "me-block-main me-d-flex-c";
    div_main.id = block.uid;
    div.appendChild(div_main);

    var span = document.createElement("span");
    var string = block.string;
    if (string.indexOf("#.") != -1) {
        div.classList.add("heading");
        string = string.substring(0, string.indexOf("#."));
    }
    span.innerHTML = convertTextToHTML(string);
    div_main.appendChild(span);
    span.addEventListener("click", (e) => {
        var x = document.querySelector(".me-focus-block");
        if (x && x != e.target) x.classList.remove("me-focus-block");
        span.classList.add("me-focus-block");
        document.addEventListener("click", (e) => {
            if (!div_main.contains(e.target)) span.classList.remove("me-focus-block");
        });
    });

    var div_add = document.createElement("div");
    div_add.className = "add-sec me-d-flex";
    div_main.appendChild(div_add);
    div_add.innerHTML = `
        <i class="fa-regular fa-image image-icon me-cp"></i>
        <i class="fa-regular fa-magnifying-glass  search-icon me-cp"></i>
    `;

    div_add.children[0].addEventListener("click", () => {
        uploadAndAddImage(div_main);
    });
    var images = [];

    student_data_array_me.images.forEach((image) => {
        if (image.linked_blocks.includes(block.uid)) images.push(image);
    });

    if (images.length) {
        images.forEach((image) => {
            //loadImagesLinkedToBlock(div_main, image);
            addImageElementInBlock(div_main, image);
        });
    }

    if (block.children) {
        var div2 = document.createElement("div");
        div2.className = "me-block-children";
        div.appendChild(div2);
        block.children.forEach((child) => {
            addPageBlocks(child, div2);
        });
    }
}

async function uploadAndAddImage(div) {
    var url = uploadImage();
    var intervalId = setInterval(() => {
        if (image_url != "") {
            clearInterval(intervalId);
            removePopupAlert();
            var input = document.createElement("input");
            input.placeholder = "Give a description to image";
            div.appendChild(input);
            document.addEventListener("mousedown", (event) => {
                if (!div.contains(event.target)) {
                    input.remove();
                }
            });
            input.addEventListener("keypress", (event) => {
                if (event.key === "Enter") {
                    var text = input.value;
                    var img = {
                        id: getUID(),
                        url: image_url,
                        text: text,
                        linked_blocks: [div.id],
                    };
                    if (!student_data_array_me.images) student_data_array_me.images = [];
                    student_data_array_me.images.push(img);
                    saveStudentData();
                    addImageElementInBlock(div, img);
                    input.remove();
                }
            });
            input.focus();
        }
    }, 1000);
}

function addImageElementInBlock(div, img) {
    var div_1 = div.querySelector(".user-images");
    if (!div_1) {
        div_1 = document.createElement("div");
        div_1.className = "user-images me-cp";
        //div.insertBefore(div_1, div.lastElementChild);
        div.appendChild(div_1);
        div_1.innerHTML = `
        <div class="head">
            <span class="text">User Images</span>
            <span class="num">1</span>
        </div>
        <div class="images hide"></div>
        `;

        div_1.children[0].addEventListener("click", () => {
            div_1.children[1].classList.toggle("hide");
        });
    }
    var div_2 = document.createElement("div");
    div_2.className = "image";
    div_2.id = img.id;
    div_2.innerHTML = `
    <div class="top me-d-flex">
        <i class="fa-regular fa-arrow-up up-icon me-mla hide "></i>
        <i class="fa-regular fa-arrow-down down-icon hide"></i>
        <i class="fa-regular fa-xmark cross-icon me-mla"></i>
    </div>
    <img src="${img.url}" alt="">
    <span class="text" contenteditable="true" >${img.text}</span>
    `;
    div_1.querySelector(".images").appendChild(div_2);

    div_1.querySelector(".head .num").textContent = div_1.querySelectorAll("img").length;
    div_2.querySelector(".cross-icon").addEventListener("click", (e) => {
        var id = div.id;
        img.linked_blocks = removeItemFromArray(id, img.linked_blocks);
        saveStudentData();
        div_2.remove();
        if (!div_1.querySelector("img")) div_1.remove();
    });
    div_2.querySelector("img").addEventListener("click", (e) => {
        showImagesInOverlay(e, "page-images");
    });
    div_2.querySelector(".text").addEventListener("input", (e) => {
        var text = e.target.textContent.trim();
        if (text == "") {
            text = "Add some text for image";
        }
        img.text = text;
        saveStudentData();
    });
}

function showImagesInOverlay(e, type) {
    var div = getImageOverlayTemplate();
    var all_user_images;
    if (type == "all-images") all_user_images = document.querySelectorAll(".all-images .user-images img");
    if (type == "page-images") all_user_images = document.querySelectorAll(".me-page .user-images img");
    var curr_img_index = 0;
    all_user_images.forEach((img, index) => {
        if (img == e.target) curr_img_index = index;
    });
    displayImageInOverlay(div, curr_img_index, all_user_images);
    div.querySelector(".next").addEventListener("click", () => {
        ++curr_img_index;
        if (curr_img_index == all_user_images.length) --curr_img_index;
        displayImageInOverlay(div, curr_img_index, all_user_images);
        return;
    });
    div.querySelector(".prev").addEventListener("click", () => {
        --curr_img_index;
        if (curr_img_index < 0) ++curr_img_index;
        displayImageInOverlay(div, curr_img_index, all_user_images);
        return;
    });
}
function displayImageInOverlay(div, index, all_user_images) {
    div.querySelector("img").src = all_user_images[index].src;
}

var global_temp_arr = [];

function showAllImageNotes(type) {
    var div = document.querySelector(".all-images-list");
    var all_images = [];
    var pages = pages_data.pages;
    pages.forEach((page) => {
        var div1 = document.createElement("div");
        div1.className = "chapter me-d-flex-c";
        div1.innerHTML = `
         <div class="head me-cp me-d-flex">
            <span class="chapter-name">${page.title}</span>
            <span class="num"></span>
        </div>
        <div class="user-images hide"></div>
        `;
        var blocks = page.blocks;
        all_images = [];
        blocks.forEach((block) => {
            all_images = checkImageInBlock(block, all_images);
        });
        if (all_images.length) {
            div.appendChild(div1);

            div1.children[0].addEventListener("click", () => {
                div1.children[1].classList.toggle("hide");
            });
            div1.querySelector(".num").textContent = all_images.length;

            all_images.forEach((img) => {
                var div2 = document.createElement("div");
                div2.className = "image";
                div2.id = img.id;
                div2.innerHTML = `
                <img src="${img.url}" alt="">
                <span class="text" contenteditable="true" >${img.text}</span>
                `;
                div1.children[1].appendChild(div2);
                div2.children[0].addEventListener("click", (e) => {
                    showImagesInOverlay(e, "all-images");
                });
                div2.children[1].addEventListener("input", (e) => {
                    var text = div2.children[1].textContent.trim();
                    if (text == "") {
                        text = "Add some text for image";
                    }
                    img.text = text;
                    saveStudentData();
                });
            });
        }
    });

    displayInMainPage("me-page");
}
function checkImageInBlock(block, all_images) {
    var uid = block.uid;
    student_data_array_me.images.forEach((image) => {
        if (image.linked_blocks.includes(uid)) all_images.push(image);
    });
    var children = block.children;
    if (children) {
        children.forEach((block) => {
            all_images = checkImageInBlock(block, all_images);
        });
    }
    return all_images;
}

function displayInMainPage(arg) {
    document.querySelectorAll(".main-page > div").forEach((div) => {
        div.classList.add("hide");
    });
    if (arg == "home") {
        document.querySelector(".main-page .home-page").classList.remove("hide");
    } else if (arg == "questions") {
        document.querySelector(".main-page .practice-que-sec").classList.remove("hide");
    } else if (arg == "me-page") {
        document.querySelector(".main-page .me-page").classList.remove("hide");
    } else if (arg == "all-images") {
        document.querySelector(".main-page .all-images").classList.remove("hide");
    }
}
displayInMainPage("home");

function showQuestion(id) {
    var b = document.querySelector(".linked-questions-section");
    if (b) {
        b.remove();
    }
    if (id) {
        roam_data_array_me.questions.forEach((que) => {
            if (que.id == id) curr_que = que;
        });
    } else {
        curr_que = filter_questions[curr_que_index];
    }

    var div = document.querySelector(".practice-que-sec");
    // adding question section HTML
    div.querySelector(".que-section").replaceWith(getQuestionSectionHTMLTemplate(curr_que));
    // adding question and explanation text
    div.querySelector(".que-section .question").innerHTML = convertTextToHTML(curr_que.question_text);
    div.querySelector(".que-section .explanation").innerHTML = convertTextToHTML(curr_que.explanation);

    // adding level or MCQ option based on the question type
    var abc = "";
    if (curr_que.type == "normal") {
        div.querySelector(".que-section .question").classList.add("normal");
        abc = getLevelsHTMLTemplate(curr_que);
    } else {
        div.querySelector(".que-section .question").classList.add("mcq");
        abc = getMCQOptionsTemplate(curr_que);
    }
    var target = div.querySelector(".que-section");
    var before = div.querySelector(".que-section .que-tags");
    target.insertBefore(abc, before);

    // adding current question tags
    if (curr_que.tags && curr_que.tags.length) addCurrentQuestionTags();

    if (curr_que.explanation != "") {
        var check_answer_element = div.querySelector(".que-section .check-answer");
        check_answer_element.classList.remove("hide");
        check_answer_element.addEventListener("click", () => {
            var explanation_element = div.querySelector(".que-section .explanation");
            explanation_element.classList.toggle("hide");
        });
    }

    if (curr_que.page_uid && curr_que.page_uid != "") {
        var chapter_element = div.querySelector(".chapter");
        var page_title = getPageTitle(curr_que.page_uid);
        chapter_element.textContent = page_title;
        chapter_element.addEventListener("click", (event) => {
            showLinkedQuestions(curr_que.page_uid, "chapter", chapter_name);
        });
    }

    if (curr_que.block_uid && curr_que.block_uid != "") {
        var read_ncert_text = div.querySelector(".que-section .read-in-ncert");
        read_ncert_text.classList.remove("hide");
        read_ncert_text.addEventListener("click", () => {
            //var uid = curr_que.block_uid;
            let today = getTodayDate_YYYYMMDDD();
            if (!curr_que.revise_dates.includes(today)) curr_que.revise_dates.push(today);
            //openBlock(uid);
            openAndScrollToBlock(curr_que.page_uid, curr_que.block_uid);
        });
    }
}

function addCurrentQuestionTags() {
    var tags = curr_que.tags;
    var target = document.querySelector(".que-section .que-tags");
    target.classList.remove("hide");
    target.innerHTML = "";
    tags.forEach((tag) => {
        var tag_element = getTagElement(tag);
        target.appendChild(tag_element); //(tag_element, target.lastElementChild);
        tag_element.children[0].addEventListener("click", (event) => {
            showLinkedQuestions(tag);
        });
        tag_element.children[1].style.display = "none";
    });
}
function getTagElement(tag) {
    var div = document.createElement("div");
    div.className = "tag";
    div.innerHTML = `<span class="name">${tag}</span>
                     <span class="remove-tag">x</span>`;
    return div;
}

function getImageOverlayTemplate() {
    var div = document.createElement("div");
    div.className = "me-image-overlay me-io";
    div.innerHTML = `
    <i class="fa-regular fa-xmark cross-icon me-mla"></i>
    <img id="overlay-img" class="overlay-img" src="" alt="Image" />
    <i class="fa-regular fa-chevron-left prev"></i>
    <i class="fa-regular fa-chevron-right next"></i>
    `;
    document.body.appendChild(div);
    div.querySelector(".cross-icon").addEventListener("click", () => {
        div.remove();
    });

    return div;
}

function showLinkedQuestions(tag, type, name) {
    var b = document.querySelector(".linked-questions-section");
    if (b) b.remove();

    var div = document.createElement("div");
    div.className = "linked-questions-section lqs me-d-flex-c";
    var target = document.querySelector(".practice-que-sec");
    target.appendChild(div);

    div.innerHTML = `
    <div class="top me-d-flex">
        <div class="me-lable-sec me-d-flex-c"></div>
        <i class="fa-regular fa-xmark-large cross-icon me-cp me-mla"></i>
    </div>
    <div class="linked-question-list"></div>
    `;

    div.querySelector(".cross-icon").addEventListener("click", () => {
        div.remove();
    });
    var label_sec = div.querySelector(".me-lable-sec");
    var target = div.querySelector(".linked-question-list");
    var num = 0;

    if (type == "chapter") {
        var page_uid = tag;

        roam_data_array_me.questions.forEach((que) => {
            if (que.page_uid == page_uid) {
                ++num;
                addLinkedQuestionSpan(que, target);
            }
        });

        label_sec.innerHTML = `
                <span class="head">Questions Linked to Chapter "${name}"</span>
                <span class="result">${num} question found</span>
                `;

        return;
    } else if (type == "pyq-year") {
        let year = tag;

        roam_data_array_me.questions.forEach((que) => {
            if (que.type == "pyq" && que.year == year) {
                ++num;
                addLinkedQuestionSpan(que, target);
            }
        });
        label_sec.innerHTML = `
                <span class="head">NEET Biology ${year} PYQs</span>
                <span class="result">${num} question found</span>
                `;
        return;
    } else {
        roam_data_array_me.questions.forEach((que) => {
            if (que.tags.includes(tag)) {
                ++num;
                addLinkedQuestionSpan(que, target);
            }
        });

        label_sec.innerHTML = `
                <span class="head">Questions Linked to tag "${tag}"</span>
                <span class="result">${num} question found</span>
                `;
    }

    div.scrollIntoView({ behavior: "smooth" });
}

function addLinkedQuestionSpan(que, target) {
    var span = document.createElement("span");
    span.innerHTML = convertTextToHTML(que.question_text);
    target.appendChild(span);
    if (que.block_uid && que.block_uid != "") {
        span.classList.add("me-link");
        span.addEventListener("click", (event) => {
            openAndScrollToBlock(que.page_uid, que.block_uid);
        });
    }
}

function openAndScrollToBlock(page_uid, block_uid) {
    var x = document.querySelector(".me-page-title");
    if (!x || x.id != page_uid) openRoamPage(page_uid);

    displayInMainPage("me-page");
    var div = document.querySelector(`div[id="${block_uid}"]`);
    div.children[0].classList.add("me-focus-block");
    div.scrollIntoView({ behavior: "smooth" });

    return;

    var id = block_uid;
    setTimeout(function () {
        document.querySelector(".que-add-message").classList.add("hide");
    }, 500);

    var intervalId = setInterval(() => {
        var div = document.querySelector(`div[id="${block_uid}"]`);
        div.scrollIntoView({ behavior: "smooth" });
    }, 1000);
}

//Templates
function getQuestionSectionHTMLTemplate(que) {
    var div = document.createElement("div");
    div.className = "que-section";
    div.innerHTML = `
    <span class="question">Sorry! .. No question found </span>
    <div class="que-tags tags hide"> </div>
    <span class="chapter me-link hide"></span>
    <div class="answer-section">
        <span class="check-answer hide me-cp">Check Answer</span>
        <span class="read-in-ncert me-link hide">read ncert text</span>
    </div>
    <span class="explanation hide"></span>
    <div class="related-questions hide">Related questions</div>
    <div class="bottom me-d-flex">
        <button class="me-btn prev me-mla me-d-flex hide">
            <i class="fa-regular fa-chevron-left"></i>
            <span>Previous</span>
        </button>
        <button class="me-btn me-d-flex me-mla next">
            <i class="fa-regular fa-shuffle"></i>
            <span class="">Random</span>
            <span class="hide">Next</span>
            <i class="fa-regular fa-chevron-right hide"></i>
        </button>
    </div>

    `;

    div.querySelector(".prev").addEventListener("click", () => {
        --curr_que_index;
        if (curr_que_index < 0) {
            ++curr_que_index;
        }
        showQuestion();
    });

    div.querySelector(".next").addEventListener("click", () => {
        ++curr_que_index;
        if (curr_que_index == filter_questions.length) {
            --curr_que_index;
        }
        showQuestion();
    });
    return div;
}
function getMCQOptionsTemplate(que) {
    var ans = que.correct_option;
    var div1 = document.createElement("div");
    div1.className = "mcq-options-section me-d-flex-c";

    var span = document.createElement("span");
    span.style.margin = "7px 5px";
    span.textContent = "Select the correct option:";
    div1.appendChild(span);

    var div = document.createElement("div");
    div.className = "mcq-options me-d-flex";
    div1.appendChild(div);
    for (var i = 0; i < 4; i++) {
        var span = document.createElement("span");
        span.className = "option me-cp";
        span.textContent = i + 1;
        div.appendChild(span);
        if (i + 1 == ans) {
            span.className = "correct option";
        }
        span.addEventListener("click", (event) => {
            div.classList.add("disable");
            checkMcqAnswer(event, que);
        });
    }
    if (que.type == "pyq") {
        var span = document.createElement("span");
        span.textContent = `( NEET ${que.year} )`;
        span.className = "pyq-year me-mla me-link";
        span.addEventListener("click", (event) => {
            showLinkedQuestions(que.year, "pyq-year");
        });
        div1.append(span);
    }
    return div1;
}
function getLevelsHTMLTemplate(que) {
    var div = document.createElement("div");
    div.className = "levels me-d-flex";
    div.innerHTML = `
        <span class="me-label">Level:</span>
        <span class="level easy me-cp">easy</span>
        <span class="level medium me-cp">medium</span>
        <span class="level hard me-cp">hard</span>
    `;
    div.querySelectorAll(".level").forEach((level) => {
        level.addEventListener("click", (event) => {
            var level_span = event.target;
            var que = getCurrentQuestionFromStudentData(curr_que.id);
            que.level = level_span.textContent;
            var x = div.querySelector(".level.active");
            if (x) {
                x.classList.remove("active");
            }
            level_span.classList.add("active");

            saveStudentData();
        });
    });

    return div;
}

// Common Functions
function getCurrentQuestionFromStudentData(id) {
    var st_que = null;
    if (!student_data_array_me.questions) student_data_array_me.questions = [];

    // see if linked question is already there
    student_data_array_me.questions.forEach((que) => {
        if (que.id == id) st_que = que;
    });

    if (!st_que) {
        // if question not found.
        st_que = {
            id: id,
            level: "",
            tags: [],
            incorret_questions: [],
        };
        console.log("me: new student question object created");
        student_data_array_me.questions.push(st_que);
        saveStudentData();
    }
    return st_que;
}
function saveStudentData() {
    saveDataInLocale("student_data_array_me", student_data_array_me);
    console.log("student data saved in locale");
}
function getStudentData() {
    var data = getDataFromLocale("student_data_array_me");
    if (data) {
        student_data_array_me = data;
    }

    console.log("student data retrieved from locale");
}
function saveDataInLocale(key, array) {
    try {
        const jsonData = JSON.stringify(array);
        localStorage.setItem(key, jsonData);
        console.log(`Data with key "${key}" saved in locale successfully`);
    } catch (error) {
        console.error(`Error saving data with key "${key}" in local storage:`, error);
    }
}
function getDataFromLocale(key) {
    try {
        const jsonData = localStorage.getItem(key);
        if (jsonData === null) {
            console.log(`No local data is found for key: ${key}`);
            return null;
        }
        var data = JSON.parse(jsonData);
        console.log(`Local data for key "${key}" retrived successfully from locale`);
        return data;
    } catch (error) {
        console.error(`Error retrieving local data with key "${key}" from localStorage`);
        return null;
    }
}

function getBlockInfo(uid) {
    console.log("me: getBlockInfo called");
    const blocks = window.roamAlphaAPI.q(`[:find ( pull  ?block [ * {:block/children ...} ] ):where[?block :block/uid \"${uid}\"]]`);

    return blocks.length ? blocks : null;
}
function convertTextToHTML(inputText) {
    let htmlText = inputText.replace(/\n/g, "<br>");
    htmlText = htmlText.replace(/\*\*(.*?)\*\*/g, '<span class="rm-bold">$1</span>');
    htmlText = htmlText.replace(/\^\^(.*?)\^\^/g, '<span class="rm-highlight">$1</span>');
    htmlText = htmlText.replace(/!\[\]\((.*?)\)/g, '<img src="$1" alt="image" style="width:100%">');
    htmlText = htmlText.replace(/\[([^\]]+)]\(([^)]+)\)/g, '<a href="$2">$1</a>');
    return htmlText;
}

function getDataFromGit(id, filename) {
    const apiUrl = `https://api.github.com/gists/${id}`;

    return fetch(apiUrl)
        .then((response) => response.json())
        .then((gistData) => {
            if (gistData.files && gistData.files[filename]) {
                const fileContent = gistData.files[filename].content;
                const parsedData = JSON.parse(fileContent);
                console.log(`Data from "${filename}" retrieved successfully`);
                return parsedData;
            } else {
                console.error("File not found in the Gist.");
            }
        })
        .catch((error) => {
            console.error("Error getting data from the Gist:", error);
        });
}

function getPageTitle(uid) {
    var pages = pages_data.pages;
    for (var i = 0; i < pages.length; i++) {
        if (pages[i].uid == uid) return pages[i].title;
    }
}

function saveDataInGit(type) {
    var data;
    var filename;
    var id;
    if (type == "pages") {
        data = JSON.stringify(pages_data);
        id = "53593a25b5bc8b0ca8046ff2bfc08eb9";
        filename = "neet_roam_data_pages.json";
    } else if (type == "questions") {
        data = roam_data_array_me;
        id = "ac87508b4fe688abef61649f9674fabb";
        filename = "neet_roam_data_questions.json";
    }
    const newContent = JSON.stringify(data, null, 2); // Convert data to JSON string with formatting
    const apiUrl = `https://api.github.com/gists/${id}`;
    fetch(apiUrl, {
        method: "PATCH",
        headers: {
            Authorization: `token ${git_api}`,
        },
        body: JSON.stringify({
            files: {
                [filename]: {
                    content: newContent,
                },
            },
        }),
    })
        .then((response) => {
            if (response.ok) {
                return response.json();
            } else {
                console.error(`Failed to update data in the "${filename}" file. Status code: ${response.status}`);
            }
        })
        .then((data) => {
            console.log(`Data in "${filename}" updated successfully.`);
        })
        .catch((error) => {
            console.error(`Error updating data in the "${filename}" file:`, error);
        });
}

var git_api = "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";

function getTodayDate_YYYYMMDDD() {
    const today = new Date();

    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0"); // Months are zero-based
    const day = String(today.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
}
function getUID() {
    const alphanumericChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let uid = "";

    for (let i = 0; i < 9; i++) {
        const randomIndex = Math.floor(Math.random() * alphanumericChars.length);
        uid += alphanumericChars.charAt(randomIndex);
    }

    return uid;
}

function sortArrayRandomly(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}
function removeItemFromArray(item, array) {
    const index = array.indexOf(item);
    if (index !== -1) {
        array.splice(index, 1);
    }
    return array;
}
