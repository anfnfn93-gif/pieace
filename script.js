/* =========================================
   MY LIFE - SCRIPT
   Supabase 댓글 저장 버전
========================================= */


/* =========================================
   SUPABASE 설정
========================================= */

const SUPABASE_URL =
    "https://dlibzkietlmhpkujuvdx.supabase.co";

const SUPABASE_KEY =
    "sb_publishable_WutwpszEMXIXFG_GMY5IbA_J5TSFxsd";


/* =========================================
   SUPABASE 요청 함수
========================================= */

async function supabaseRequest(endpoint, options = {}) {

    const response = await fetch(
        `${SUPABASE_URL}/rest/v1/${endpoint}`,
        {
            ...options,

            headers: {
                "apikey": SUPABASE_KEY,
                "Authorization": `Bearer ${SUPABASE_KEY}`,
                "Content-Type": "application/json",
                "Prefer": options.method === "POST"
                    ? "return=representation"
                    : "return=minimal",

                ...(options.headers || {})
            }
        }
    );

    if (!response.ok) {

        const errorText =
            await response.text();

        console.error(
            "Supabase 오류:",
            response.status,
            errorText
        );

        throw new Error(
            `Supabase 오류 ${response.status}: ${errorText}`
        );
    }

    const text =
        await response.text();

    return text
        ? JSON.parse(text)
        : null;
}


/* =========================================
   페이지 로딩
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


            if (
                headerLike.classList.contains("liked")
            ) {

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
                followButton.classList.contains(
                    "following"
                );


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

                    card.style.display =
                        "block";

                } else {

                    if (
                        card.classList.contains(filter)
                    ) {

                        card.style.display =
                            "block";

                    } else {

                        card.style.display =
                            "none";

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
       OPEN MODAL
    ====================================== */

    postCards.forEach(card => {

        card.addEventListener("click", async () => {


            currentPost =
                card;


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

            modal.classList.add("show");

            document.body.style.overflow =
                "hidden";


            await loadComments();

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
       LOAD COMMENTS FROM SUPABASE
    ====================================== */

    async function loadComments() {

        if (!currentPost) {
            return;
        }


        const postId =
            currentPost.dataset.title || "";


        try {

            const encodedPostId =
                encodeURIComponent(postId);


            const data =
                await supabaseRequest(
                    `comments?post_id=eq.${encodedPostId}` +
                    `&select=id,post_id,name,text,created_at` +
                    `&order=created_at.asc`
                );


            renderComments(data || []);

        } catch (error) {

            console.error(
                "댓글 불러오기 실패:",
                error
            );


            commentList.innerHTML = "";


            const errorMessage =
                document.createElement("div");


            errorMessage.className =
                "comment-empty";


            errorMessage.innerHTML =
                "댓글을 불러오지 못했습니다.<br>" +
                "잠시 후 다시 시도해주세요.";


            commentList.appendChild(
                errorMessage
            );


            commentCount.textContent =
                "0";

        }

    }


    /* =====================================
       RENDER COMMENTS
    ====================================== */

    function renderComments(
        postComments
    ) {

        if (!commentList) {
            return;
        }


        commentList.innerHTML =
            "";


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


            const name =
                escapeHtml(
                    comment.name || ""
                );


            const text =
                escapeHtml(
                    comment.text || ""
                );


            const date =
                formatCommentDate(
                    comment.created_at
                );


            item.innerHTML = `

                <div class="comment-name">
                    ${name}
                </div>

                <div class="comment-text">
                    ${text}
                </div>

                <span class="comment-date">
                    ${escapeHtml(date)}
                </span>

            `;


            commentList.appendChild(
                item
            );

        });

    }


    /* =====================================
       ADD COMMENT
    ====================================== */

    async function addComment() {


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
            currentPost.dataset.title || "";


        /* 버튼 중복 클릭 방지 */

        if (commentBtn) {

            commentBtn.disabled =
                true;

        }


        try {

            await supabaseRequest(
                "comments",
                {
                    method: "POST",

                    body: JSON.stringify({
                        post_id: postId,
                        name: "조성현",
                        text: text
                    })
                }
            );


            /* 입력창 비우기 */

            commentInput.value =
                "";


            /* 저장된 댓글 다시 불러오기 */

            await loadComments();


        } catch (error) {

            console.error(
                "댓글 저장 실패:",
                error
            );


            alert(
                "댓글 저장에 실패했습니다.\n" +
                "잠시 후 다시 시도해주세요."
            );


        } finally {

            if (commentBtn) {

                commentBtn.disabled =
                    false;

            }

        }

    }


    /* =====================================
       COMMENT BUTTON
    ====================================== */

    if (commentBtn) {

        commentBtn.addEventListener(
            "click",
            addComment
        );

    }


    /* =====================================
       COMMENT ENTER
    ====================================== */

    if (commentInput) {

        commentInput.addEventListener(
            "keydown",
            event => {

                if (
                    event.key === "Enter"
                ) {

                    event.preventDefault();

                    addComment();

                }

            }
        );

    }


    /* =====================================
       COMMENT DATE
    ====================================== */

    function formatCommentDate(
        dateString
    ) {

        if (!dateString) {
            return "";
        }


        const date =
            new Date(dateString);


        if (
            Number.isNaN(
                date.getTime()
            )
        ) {

            return "";

        }


        const year =
            date.getFullYear();


        const month =
            String(
                date.getMonth() + 1
            ).padStart(2, "0");


        const day =
            String(
                date.getDate()
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
