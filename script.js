/* =========================================
   MY LIFE - SCRIPT
========================================= */


document.addEventListener("DOMContentLoaded", () => {


    /* =====================================
       HEADER LIKE
    ====================================== */

    const headerLike =
        document.getElementById("headerLike");


    if (headerLike) {

        headerLike.addEventListener("click", () => {

            headerLike.classList.toggle("liked");


            if (headerLike.classList.contains("liked")) {

                headerLike.textContent = "♥";

            } else {

                headerLike.textContent = "♡";

            }

        });

    }



    /* =====================================
       FOLLOW
    ====================================== */

    const followButton =
        document.getElementById("followButton");


    if (followButton) {

        followButton.addEventListener("click", () => {


            const isFollowing =
                followButton.classList.contains("following");


            if (isFollowing) {

                followButton.classList.remove(
                    "following"
                );

                followButton.textContent =
                    "팔로우";

            } else {

                followButton.classList.add(
                    "following"
                );

                followButton.textContent =
                    "팔로잉";

            }

        });

    }



    /* =====================================
       MENU
    ====================================== */

    const menuButton =
        document.getElementById("menuButton");


    if (menuButton) {

        menuButton.addEventListener("click", () => {

            alert(
                "MY LIFE\n\n" +
                "조성현의 개인 홈페이지입니다."
            );

        });

    }



    /* =====================================
       PROFILE TABS
    ====================================== */

    const tabs =
        document.querySelectorAll(".tab");


    const postCards =
        document.querySelectorAll(".post-card");


    tabs.forEach(tab => {

        tab.addEventListener("click", () => {


            tabs.forEach(item => {

                item.classList.remove("active");

            });


            tab.classList.add("active");


            const filter =
                tab.dataset.filter;


            postCards.forEach(card => {


                if (filter === "all") {

                    card.style.display = "block";

                } else {

                    if (
                        card.classList.contains(filter)
                    ) {

                        card.style.display = "block";

                    } else {

                        card.style.display = "none";

                    }

                }

            });

        });

    });



    /* =====================================
       MODAL
    ====================================== */

    const modal =
        document.getElementById("postModal");


    const modalBackground =
        document.querySelector(".modal-background");


    const modalClose =
        document.getElementById("modalClose");


    const modalImage =
        document.getElementById("modalImage");


    const modalIcon =
        document.getElementById("modalIcon");


    const modalTitle =
        document.getElementById("modalTitle");


    const modalText =
        document.getElementById("modalText");


    const modalType =
        document.getElementById("modalType");


    const modalLike =
        document.getElementById("modalLike");


    let currentPost =
        null;



    /* =====================================
       COMMENTS DATA
    ====================================== */

    const comments = {};



    /* =====================================
       OPEN MODAL
    ====================================== */

    postCards.forEach(card => {

        card.addEventListener("click", () => {


            currentPost = card;


            const title =
                card.dataset.title || "";


            const type =
                card.dataset.type || "";


            const content =
                card.dataset.content || "";


            const icon =
                card.dataset.icon || "👤";


            const popupImage =
                card.dataset.popupImage;


            modalTitle.textContent =
                title;


            modalType.textContent =
                type;


            modalText.textContent =
                content;


            modalIcon.textContent =
                icon;


            modalLike.textContent =
                "♡";


            modalLike.classList.remove(
                "liked"
            );


            /* =================================
               POPUP IMAGE
            ================================== */

            modalImage.classList.remove(
                "has-popup-image"
            );


            modalImage.style.backgroundImage =
                "none";


            if (popupImage) {

                modalImage.classList.add(
                    "has-popup-image"
                );


                modalImage.style.backgroundImage =
                    `url("${popupImage}")`;

            }


            /* =================================
               COMMENTS
            ================================== */

            renderComments();


            modal.classList.add("show");


            document.body.style.overflow =
                "hidden";

        });

    });



    /* =====================================
       CLOSE MODAL
    ====================================== */

    function closeModal() {

        modal.classList.remove("show");

        document.body.style.overflow =
            "";

    }


    if (modalClose) {

        modalClose.addEventListener(
            "click",
            closeModal
        );

    }


    if (modalBackground) {

        modalBackground.addEventListener(
            "click",
            closeModal
        );

    }


    document.addEventListener(
        "keydown",
        event => {

            if (
                event.key === "Escape" &&
                modal.classList.contains("show")
            ) {

                closeModal();

            }

        }
    );



    /* =====================================
       MODAL LIKE
    ====================================== */

    if (modalLike) {

        modalLike.addEventListener("click", () => {


            modalLike.classList.toggle(
                "liked"
            );


            if (
                modalLike.classList.contains(
                    "liked"
                )
            ) {

                modalLike.textContent =
                    "♥";

            } else {

                modalLike.textContent =
                    "♡";

            }

        });

    }



    /* =====================================
       COMMENT ELEMENTS
    ====================================== */

    const commentInput =
        document.getElementById(
            "commentInput"
        );


    const commentBtn =
        document.getElementById(
            "commentBtn"
        );


    const commentList =
        document.getElementById(
            "commentList"
        );


    const commentCount =
        document.getElementById(
            "commentCount"
        );



    /* =====================================
       RENDER COMMENTS
    ====================================== */

    function renderComments() {


        if (!currentPost) {
            return;
        }


        const postId =
            currentPost.dataset.title;


        const postComments =
            comments[postId] || [];


        commentList.innerHTML = "";


        commentCount.textContent =
            postComments.length;


        if (
            postComments.length === 0
        ) {

            const empty =
                document.createElement("div");


            empty.className =
                "comment-empty";


            empty.innerHTML =
                "아직 댓글이 없습니다.<br>" +
                "첫 번째 댓글을 남겨보세요.";


            commentList.appendChild(
                empty
            );


            return;

        }



        postComments.forEach(comment => {


            const item =
                document.createElement("div");


            item.className =
                "comment-item";


            item.innerHTML = `

                <div class="comment-name">
                    ${escapeHtml(comment.name)}
                </div>

                <div class="comment-text">
                    ${escapeHtml(comment.text)}
                </div>

                <span class="comment-date">
                    ${escapeHtml(comment.date)}
                </span>

            `;


            commentList.appendChild(item);

        });

    }



    /* =====================================
       ADD COMMENT
    ====================================== */

    function addComment() {


        if (!currentPost) {
            return;
        }


        const text =
            commentInput.value.trim();


        if (!text) {

            commentInput.focus();

            return;

        }


        const postId =
            currentPost.dataset.title;


        if (!comments[postId]) {

            comments[postId] = [];

        }


        comments[postId].push({

            name: "조성현",

            text: text,

            date: getCurrentDate()

        });


        commentInput.value = "";


        renderComments();

    }



    if (commentBtn) {

        commentBtn.addEventListener(
            "click",
            addComment
        );

    }


    if (commentInput) {

        commentInput.addEventListener(
            "keydown",
            event => {

                if (
                    event.key === "Enter"
                ) {

                    addComment();

                }

            }
        );

    }



    /* =====================================
       DATE
    ====================================== */

    function getCurrentDate() {

        const now =
            new Date();


        const year =
            now.getFullYear();


        const month =
            String(
                now.getMonth() + 1
            ).padStart(2, "0");


        const day =
            String(
                now.getDate()
            ).padStart(2, "0");


        return `${year}.${month}.${day}`;

    }



    /* =====================================
       HTML ESCAPE
    ====================================== */

    function escapeHtml(value) {

        const div =
            document.createElement("div");


        div.textContent =
            value;


        return div.innerHTML;

    }


});