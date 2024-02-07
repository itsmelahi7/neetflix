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
    //get question data from git

    var filename = "neet_roam_data_questions.json";
    var id = "ac87508b4fe688abef61649f9674fabb";
    data = await getDataFromGit(id, filename);
    if (data) {
        roam_data_array_me = data;
    }
    console.log("me: pages and question data loaded");

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
            displayInMainPage("roam-page");
        }
    });
    console.log("me: initial loading is completed");
    setEventListnersForQuestionSection();
}
initialLoading();

function setEventListnersForQuestionSection() {
    var toc_icon = document.querySelector(".head .toc-icon");
    toc_icon.addEventListener("click", getTableOfContentForCurrentPage);

    var filter_tag_input = document.querySelector(".practice-que-sec .filter-sec input ");
    filter_tag_input.addEventListener("focus", (event) => {
        setAutoComplete(event, all_tags, "que-filter-tags");
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
    document.querySelector(".main-page-content").append(div);
    return div;
}
function getPageBlocks(uid) {
    var pages = pages_data.pages;
    for (var i = 0; i < pages.length; i++) {
        if (pages[i].uid == uid) return pages[i].blocks;
    }
    return null;
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
    var page = "";
    var pages = pages_data.pages;
    for (var i = 0; i < pages.length; i++) {
        if (pages[i].uid == page_uid) {
            page = pages[i];
            break;
        }
    }
    var b = document.querySelector(".me-page");
    if (b) b.remove();
    var page_div = document.createElement("div");
    page_div.className = "me-page";
    document.querySelector(".main-page-content").appendChild(page_div);

    var span = document.createElement("span");
    span.className = "me-page-title";
    span.id = page.uid;
    span.textContent = page.title;
    page_div.appendChild(span);

    page.blocks.forEach((block) => {
        addPageBlocks(block, page_div);
    });

    displayInMainPage("roam-page");
    return;
    page.blocks.forEach((block) => {
        var div = document.createElement("div");
        div.className = "me-block";
        div.id = block.uid;
        page_div.appendChild(div);

        var span = document.createElement("span");
        span.className = "me-block";
        //span.id = block.uid;
        var string = block.string;
        if (string.indexOf("#.me-") != -1 || string.indexOf("#.hh") != -1) {
            span.classList.add("heading");
            string = string.substring(0, string.indexOf("#"));
        }
        span.innerHTML = convertTextToHTML(string);
        div.appendChild(span);
    });
}
function addPageBlocks(block, target) {
    var div = document.createElement("div");
    div.className = "me-block";
    target.appendChild(div);

    var div_main = document.createElement("div");
    div_main.className = "me-block-main me-d-flex-c";
    div_main.id = block.uid;
    div.appendChild(div_main);
    div_main.addEventListener("click", (e) => {
        var x = document.querySelector(".me-focus-block");
        if (x && x != e.target) x.classList.remove("me-focus-block");
        div_main.classList.add("me-focus-block");
        document.addEventListener("click", (e) => {
            if (!div_main.contains(e.target)) div_main.classList.remove("me-focus-block");
        });
    });

    var span = document.createElement("span");
    var string = block.string;
    if (string.indexOf("#.") != -1) {
        div.classList.add("heading");
        string = string.substring(0, string.indexOf("#."));
    }
    span.innerHTML = convertTextToHTML(string);
    div_main.appendChild(span);

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
        div.insertBefore(div_1, div.lastElementChild);
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
        <i class="fa-regular fa-arrow-up up-icon me-mla"></i>
        <i class="fa-regular fa-arrow-down down-icon"></i>
        <i class="fa-regular fa-xmark cross-icon"></i>
    </div>
    <img src="${img.url}" alt="">
    `;
    div_1.querySelector(".images").appendChild(div_2);
    div_1.querySelector(".head .num").textContent = div_1.querySelectorAll("img").length;
    div_2.querySelector("img").addEventListener("click", (e) => {
        showImagesInOverlay(e);
    });
}

function showImagesInOverlay(e) {
    var div = getImageOverlayTemplate();
    var all_user_images = document.querySelectorAll(".me-page .user-images img");
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
    debugger;
    div.querySelector("img").src = all_user_images[index].src;
}

function displayInMainPage(arg) {
    document.querySelectorAll(".main-page > div").forEach((div) => {
        div.classList.add("hide");
    });
    if (arg == "home") {
        document.querySelector(".main-page .home-page").classList.remove("hide");
    } else if (arg == "questions") {
        document.querySelector(".main-page .practice-que-sec").classList.remove("hide");
    } else if ("roam-page") {
        document.querySelector(".main-page .main-page-content").classList.remove("hide");
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
    openRoamPage(page_uid);
    var div = document.querySelector(`div[id="${block_uid}"]`);
    displayInMainPage("roam-page");
    div.classList.add("me-focus-block");
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
    if (!data) {
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
