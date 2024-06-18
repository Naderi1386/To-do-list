// all HTML element that we need

const mySwitchBtn = document.querySelector("#theme-switcher");
const mySwitchLogo = document.querySelector(".icon-sweitcher");
const myBody = document.querySelector("body");
const myAddBtn = document.querySelector("#add-btn");
const myAddInput = document.querySelector("#addt");
const myUl = document.querySelector(".todos");
const myNumberSpan = document.querySelector("#items-left");
const remove_complete = document.querySelector("#clear-completed");
const btn_show_active = document.querySelector("#active");
const btn_show_completed = document.querySelector("#completed");
const btn_show_all = document.querySelector("#all");
// localStorage.clear();

let count_duty = 0;

function main() {
  // draging event
  myUl.addEventListener("dragover", (e) => {
    e.preventDefault();
    let elements_classes = e.target.classList.contains("card");
    let elements_classes2 = e.target.classList.contains("drag-style");

    if (elements_classes == true && elements_classes2 == false) {
      const draging = document.querySelector(".drag-style");
      const all_lists = [...myUl.querySelectorAll(".card")];
      const li_draging = all_lists.indexOf(draging);
      const li_drag_selected = all_lists.indexOf(e.target);
      const li_move = myUl.children[li_draging];
      if (li_draging < li_drag_selected) {
        myUl.insertBefore(li_move, myUl.children[li_drag_selected + 1]);
      } else if (li_draging > li_drag_selected) {
        myUl.insertBefore(
          myUl.children[li_drag_selected],
          myUl.children[li_draging + 1]
        );
      }
      const local_now = [...JSON.parse(localStorage.getItem("Duty"))];
      const remove = local_now.splice(li_draging, 1);
      local_now.splice(li_drag_selected, 0, ...remove);
      localStorage.setItem("Duty", JSON.stringify(local_now));
    }
  });

  // theme switcher
  mySwitchBtn.addEventListener("click", () => {
    myBody.classList.toggle("light");
    const attr = mySwitchLogo.getAttribute("src");
    if (attr == "./assets/images/icon-sun.svg") {
      mySwitchLogo.src = "./assets/images/icon-moon.svg";
    } else {
      mySwitchLogo.src = "./assets/images/icon-sun.svg";
    }
  });

  write_to_html(JSON.parse(localStorage.getItem("Duty")));
  // write to HTML
  function write_to_html(informations) {
    if (informations == []) {
      return null;
    } else {
      informations.forEach((every) => {
        // all tags
        const li = document.createElement("li");
        li.addEventListener("dragstart", () => {
          li.classList.add("drag-style");
        });
        li.addEventListener("dragend", () => {
          li.classList.remove("drag-style");
        });

        const div = document.createElement("div");
        const input = document.createElement("input");
        input.addEventListener("click", (e) => {
          const parent = input.parentNode.parentNode;
          parent.classList.toggle("checked");
          const all_lists = [...myUl.querySelectorAll(".card")];
          const li_checked = all_lists.indexOf(parent);
          const lstorage = JSON.parse(localStorage.getItem("Duty"));
          const trueorfalse = input.checked;
          if (trueorfalse == true) {
            lstorage.forEach((obj, index) => {
              if (index == li_checked) {
                obj.isCompleted = true;
              }
            });
            localStorage.setItem("Duty", JSON.stringify(lstorage));
          } else {
            lstorage.forEach((obj, index) => {
              if (index == li_checked) {
                obj.isCompleted = false;
              }
            });
            localStorage.setItem("Duty", JSON.stringify(lstorage));
          }

          duty_left();
        });
        const span = document.createElement("span");
        const p = document.createElement("p");
        const button = document.createElement("button");
        button.addEventListener("click", () => {
          const parent = button.parentNode;
          parent.classList.add("fall");

          const all_lists = [...myUl.querySelectorAll(".card")];
          const index_delete = all_lists.indexOf(parent);
          const loc_storage = JSON.parse(localStorage.getItem("Duty"));
          loc_storage.splice(index_delete, 1);
          localStorage.setItem("Duty", JSON.stringify(loc_storage));
          duty_left();
        });

        const img = document.createElement("img");

        // all classes and attributes
        li.className = "card";
        li.setAttribute("draggable", "true");
        myUl.appendChild(li);
        div.className = "cb-container";
        li.appendChild(div);
        input.className = "cb-input";
        input.setAttribute("type", "checkbox");
        div.appendChild(input);
        span.className = "check";
        input.after(span);
        p.className = "item";
        p.innerHTML = every.duty;
        div.after(p);
        button.className = "clear";
        p.after(button);
        img.setAttribute("src", "./assets/images/icon-cross.svg");
        button.appendChild(img);
        if (every.isCompleted == true) {
          li.classList.add("checked");
          input.setAttribute("checked", "checked");
        }
        li.addEventListener("animationend", () => {
          li.remove();
        });
      });
    }
  }

  // Add to localstorage
  myAddBtn.addEventListener("click", () => {
    let subject = myAddInput.value.trim();
    myAddInput.value = "";
    if (subject != "") {
      const our_localStorage = !localStorage.getItem("Duty")
        ? []
        : JSON.parse(localStorage.getItem("Duty"));

      let object = {
        duty: subject,
        isCompleted: false,
      };
      write_to_html([object]);
      our_localStorage.push(object);
      localStorage.setItem("Duty", JSON.stringify(our_localStorage));
      duty_left();
    }
  });
  // keyboard event
  myAddInput.addEventListener("keypress", (e) => {
    if (myAddInput.value != "") {
      if (e.keyCode == "13") {
        let subject = myAddInput.value.trim();
        const our_localStorage = !localStorage.getItem("Duty")
          ? []
          : JSON.parse(localStorage.getItem("Duty"));
        let object = {
          duty: subject,
          isCompleted: false,
        };
        our_localStorage.push(object);
        write_to_html([object]);
        localStorage.setItem("Duty", JSON.stringify(our_localStorage));
        myAddInput.value = "";
        duty_left();
      }
    }
  });

  // find alive duty
  function duty_left() {
    const lstroage = [...JSON.parse(localStorage.getItem("Duty"))];
    lstroage.forEach((o) => {
      if (o.isCompleted == false) {
        count_duty++;
      }
    });
    myNumberSpan.innerHTML = count_duty;
    count_duty = 0;
  }
  duty_left();

  // remove completed duty
  remove_complete.addEventListener("click", () => {
    const all_checked = [...document.querySelectorAll(".checked")];
    all_checked.forEach((li, index) => {
      li.classList.add("fall");
      li.addEventListener("animationend", () => {
        li.remove();
      });
    });
    remove_dutys();
  });
  function remove_dutys() {
    let lcl_storage = [...JSON.parse(localStorage.getItem("Duty"))];
    let new_storage = [];
    lcl_storage.forEach((e, index) => {
      if (e.isCompleted == false) {
        new_storage.push(e);
      }
    });
    localStorage.setItem("Duty", JSON.stringify(new_storage));
  }

  // show active duty
  btn_show_active.addEventListener("click", () => {
    myUl.classList.toggle("active");
    myUl.classList.remove("completed");
    document.querySelector(".on").classList.remove("on");
    btn_show_active.classList.toggle("on");
  });

  // show completed duty
  btn_show_completed.addEventListener("click", () => {
    myUl.classList.toggle("completed");
    myUl.classList.remove("active");

    document.querySelector(".on").classList.remove("on");
    btn_show_completed.classList.toggle("on");
  });

  // show all duty
  btn_show_all.addEventListener("click", () => {
    myUl.classList.remove("completed");
    myUl.classList.remove("active");
    document.querySelector(".on").classList.remove("on");
    btn_show_all.classList.toggle("on");
  });
}

document.addEventListener("DOMContentLoaded", main);
