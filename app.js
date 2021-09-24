// 1. Render
// 2. Sroll
// 3. play/pause/seek
// 4. Rotate CD
// 5. Next/pre
// 6. Random
// 7. Next/repeat when ended
// 8. Active Song
// 9. Scroll Active into view
// 10. Play song when click
const thumb = document.querySelector(".thumb");
const title = document.querySelector(".title")
const author = document.querySelector(".author")
const playList = document.querySelector(".playlist")
const heading = document.querySelector("header h2")
const cdThumb = document.querySelector(".cd-thumb")
const audio = document.querySelector("#audio")
const playBtn = document.querySelector(".btn-toggle-play")
const player = document.querySelector(".player")
const btnNext = document.querySelector(".btn-next")
const btnPre = document.querySelector(".btn-prev")
const progress = document.querySelector("#progress")
const btnRandom = document.querySelector(".btn-random")
const repeat = document.querySelector(".btn-repeat")
const playlist = document.querySelector(".playlist")
const LOCALSTORAGEKEY = "BTN"
const app = {
    isRandom : false,
    isPlaying: false,
    isRepeat : false,
    currentIndex : 0,
    config: JSON.parse(localStorage.getItem(LOCALSTORAGEKEY)) || {},
    setcofig : function (key, value){
        this.config[key] = value;
        localStorage.setItem(LOCALSTORAGEKEY,JSON.stringify(this.config))
    },
    songs:[
        {
            name: "Va vào Giai Điệu Này",
            thumb: "img/mck.jpg",
            path: "music/Va Vào Giai Điệu Này.mp3",
            singer: "MCK"
        },
        {
            name: "Mai",
            thumb: "img/jimmy.jpg",
            path: "music/Mai.mp3",
            singer: "Jimmy"
        },
        {
            name: "bubuluw",
            thumb: "img/bubuluw.jpg",
            path: "music/bubuluw.mp3",
            singer: "no name"
        },
        {
            name: "Cưới thôi",
            thumb: "img/bray.jpg",
            path: "music/Cưới thôi.mp3", 
            singer: "bray ft tap"
        },
        {
            name: "Ghé Qua",
            thumb: "img/tofu.jpg",
            path: "music/Ghé qua.mp3",
            singer :"Dick Tofu"
        },
        
        {
            name: "Phiêu Bồng",
            thumb: "img/tofu.jpg",
            path: "music/Phiêu Bồng.mp3",
            singer: "Tofu"
        },
       
        {
            name: "Wu Sen Mi Nu",
            thumb: "img/Liu_Grace.jpg",
            path: "music/wu sen mi nu.mp3",
            singer: "Liu Grace "
        }
    ],
    defineProperties: function (){
        Object.defineProperty(this,'currentSong', {
            get: function(){
                return this.songs[this.currentIndex]
            }
        })
        
    },
    handleEvents: function () {
        const _this = this
        const cd = document.querySelector(".cd")
        const widthCD = cd.offsetWidth
        const cdRotate = cdThumb.animate([
           { transform:'rotate(360deg)'}
        ],{
            iterations: Infinity,
            duration: 10000
        })
        cdRotate.pause()
        document.addEventListener("scroll", () => {
            let scrollTop = window.scrollY
            let newWidth = widthCD - scrollTop
            cd.style.width = newWidth > 0 ?newWidth +'px' :0
            cd.style.opacity = newWidth/widthCD
        })
        audio.onplay = function () {
            _this.isPlaying  = true
            player.classList.add("playing")
            cdRotate.play()
        }
        audio.onpause = function(){
            _this.isPlaying = false;
            player.classList.remove("playing")
            cdRotate.pause()
        }
        playBtn.addEventListener("click", function() {
            if ( _this.isPlaying)         
                audio.pause()
            else 
                audio.play()     
        })
        btnNext.addEventListener("click", () => {
            if ( _this.isRandom){
                _this.random()
            }
                else  _this.nextSong()
           audio.play()
            _this.scrollIntoSong()
           _this.render()
        })
        btnPre.addEventListener("click", () => {
            if ( _this.isRandom){
                _this.random()
            }
            else _this.preSong()
            audio.play()
            _this.scrollIntoSong()

            _this.render()

        })
        audio.ontimeupdate = function () {
            if ( audio.duration){
                const time = Math.floor(audio.currentTime/ audio.duration *100)
                progress.value = time;
            }
        }
        progress.addEventListener("input", () => {
            const seekTime = (audio.duration / 100 )* progress.value;
            audio.currentTime = seekTime 
            
        })
        btnRandom.addEventListener("click", function () {
            _this.isRandom = !_this.isRandom
            _this.setcofig('isRandom', _this.isRandom)
            btnRandom.classList.toggle("active", _this.isRandom)
            
        })
        audio.onended = () => {
            if ( _this.isRepeat){
                audio.play()
            }
            else 
            btnNext.click()
        }
        repeat.addEventListener("click" , () => {
            _this.isRepeat = !_this.isRepeat;
            _this.setcofig('isRepeat', _this.isRepeat)
            repeat.classList.toggle("active", _this.isRepeat )
        })
        playlist.addEventListener("click" ,(e) => {
            const songNode = e.target.closest('.song:not(.active)') 
            if ( songNode || !e.target.closes('option')) {
                if (songNode){
                    _this.currentIndex = songNode.dataset.index;
                    _this.loadCurrentSong()
                    audio.play()
                    _this.render()
                }
            }
            
        })
    },
    loadConfig : function () {
        this.isRandom = this.config.isRandom;
        this.isRepeat = this.config.isRepeat;
    },
    loadCurrentSong: function () {
        heading.textContent = this.currentSong.name;
        cdThumb.style.backgroundImage = `url(${this.currentSong.thumb})`;
        audio.src = `${this.currentSong.path}`;
    },
    nextSong: function (){
        this.currentIndex++;
        if ( this.currentIndex >= this.songs.length){
            this.currentIndex = 0;
        }
        this.loadCurrentSong()
    }, 
    preSong: function () {
        this.currentIndex--;
        if ( this.currentIndex < 0){
            this.currentIndex = this.songs.length - 1;
        }
        this.loadCurrentSong()

    },
    random : function() {
        let newIndex;
        do{
            newIndex = Math.floor(Math.random() * this.songs.length)
        }while(newIndex == this.currentIndex )
        this.currentIndex = newIndex
        this.loadCurrentSong()
    },
    scrollIntoSong : function(){
        setTimeout(()=> {
            document.querySelector(".song.active").scrollIntoView({
                behavior: "smooth",
                block: "nearest"
            })
        }, 300)
    },
    render: function () {
        const htmls = this.songs.map((item, index) => {
            return `
        <div class="song ${this.currentIndex == index ? 'active' : ""}" data-index = '${index}'">
            <div class="thumb" style="background-image: url(${item.thumb})">
            </div>
            <div class="body">
            <h3 class="title">${item.name}</h3>
            <p class="author">${item.singer}</p>
            </div>
            <div class="option">
            <i class="fas fa-ellipsis-h"></i>
        </div>
        </div>`
        }) 
        playList.innerHTML = htmls.join("")
    },
    
    start: function() {
        this.loadConfig()

        this.defineProperties()

        this.handleEvents()
        
        // this.scrollIntoSong()

        this.loadCurrentSong()

        this.render()
        btnRandom.classList.toggle("active", _this.isRandom)
        repeat.classList.toggle("active", _this.isRepeat )
    }
}
app.start()

    
    