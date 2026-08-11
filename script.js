// ========================================
// KỲ ANH PMH - MUSIC PLAYER
// ========================================

// AUDIO
const audio = document.getElementById("audioPlayer");

// BUTTONS
const playButton = document.getElementById("playButton");
const backButton = document.getElementById("backButton");
const forwardButton = document.getElementById("forwardButton");

// PROGRESS
const progressBar = document.getElementById("progressBar");
const currentTimeDisplay = document.getElementById("currentTime");
const durationDisplay = document.getElementById("duration");

// VOLUME
const volumeBar = document.getElementById("volumeBar");
const volumeButton = document.getElementById("volumeButton");

// LYRICS
const lyricLines = document.querySelectorAll(".lyric-line");


// ========================================
// KIỂM TRA AUDIO
// ========================================

if (!audio) {

    console.error("Không tìm thấy audioPlayer");

} else {

    console.log("Audio đã được tìm thấy");


    // ====================================
    // ÂM LƯỢNG BAN ĐẦU
    // ====================================

    audio.volume = 1;
    audio.muted = false;


    if (volumeBar) {
        volumeBar.value = 1;
    }


    // ====================================
    // PLAY / PAUSE
    // ====================================

    if (playButton) {

        playButton.addEventListener("click", function () {

            if (audio.paused) {

                audio.play()
                    .then(function () {

                        playButton.textContent = "❚❚";

                    })
                    .catch(function (error) {

                        console.error(
                            "Không thể phát nhạc:",
                            error
                        );

                    });

            } else {

                audio.pause();

                playButton.textContent = "▶";

            }

        });

    }


    // ====================================
    // KHI NHẠC PLAY
    // ====================================

    audio.addEventListener("play", function () {

        if (playButton) {
            playButton.textContent = "❚❚";
        }

    });


    // ====================================
    // KHI NHẠC PAUSE
    // ====================================

    audio.addEventListener("pause", function () {

        if (playButton) {
            playButton.textContent = "▶";
        }

    });


    // ====================================
    // THỜI LƯỢNG BÀI HÁT
    // ====================================

    audio.addEventListener("loadedmetadata", function () {

        if (durationDisplay) {

            durationDisplay.textContent =
                formatTime(audio.duration);

        }

    });


    // ====================================
    // CẬP NHẬT NHẠC
    // ====================================

    audio.addEventListener("timeupdate", function () {

        const current = audio.currentTime;

        const duration = audio.duration;


        // THỜI GIAN

        if (currentTimeDisplay) {

            currentTimeDisplay.textContent =
                formatTime(current);

        }


        // THANH TIẾN TRÌNH

        if (
            progressBar &&
            Number.isFinite(duration) &&
            duration > 0
        ) {

            progressBar.value =
                (current / duration) * 100;

        }


        // LYRICS

        updateLyrics(current);

    });


    // ====================================
    // THANH TIẾN TRÌNH
    // ====================================

    if (progressBar) {

        progressBar.addEventListener(
            "input",
            function () {

                if (
                    !Number.isFinite(audio.duration) ||
                    audio.duration <= 0
                ) {

                    return;

                }


                const percent =
                    Number(progressBar.value);


                audio.currentTime =
                    (percent / 100) * audio.duration;


                updateLyrics(audio.currentTime);

            }
        );

    }


    // ====================================
    // LÙI 5 GIÂY
    // ====================================

    if (backButton) {

        backButton.addEventListener(
            "click",
            function () {

                audio.currentTime =
                    Math.max(
                        0,
                        audio.currentTime - 5
                    );

            }
        );

    }


    // ====================================
    // TIẾN 5 GIÂY
    // ====================================

    if (forwardButton) {

        forwardButton.addEventListener(
            "click",
            function () {

                audio.currentTime =
                    Math.min(
                        audio.duration,
                        audio.currentTime + 5
                    );

            }
        );

    }


    // ====================================
    // ÂM LƯỢNG
    // ====================================

    if (volumeBar) {

        volumeBar.addEventListener(
            "input",
            function () {

                const volume =
                    Number(this.value);


                console.log(
                    "Âm lượng:",
                    volume
                );


                audio.muted = false;

                audio.volume = volume;


                if (volume === 0) {

                    if (volumeButton) {
                        volumeButton.textContent = "🔇";
                    }

                }

                else if (volume < 0.5) {

                    if (volumeButton) {
                        volumeButton.textContent = "🔉";
                    }

                }

                else {

                    if (volumeButton) {
                        volumeButton.textContent = "🔊";
                    }

                }

            }
        );

    }


    // ====================================
    // MUTE
    // ====================================

    if (volumeButton) {

        volumeButton.addEventListener(
            "click",
            function () {

                if (audio.muted) {

                    audio.muted = false;


                    // Nếu volume đang bằng 0
                    // thì đưa lên 50%

                    if (audio.volume === 0) {

                        audio.volume = 0.5;

                        if (volumeBar) {
                            volumeBar.value = 0.5;
                        }

                    }


                    volumeButton.textContent = "🔊";

                }

                else {

                    audio.muted = true;

                    volumeButton.textContent = "🔇";

                }

            }
        );

    }


    // ====================================
    // KHI BÀI HÁT KẾT THÚC
    // ====================================

    audio.addEventListener("ended", function () {

        if (playButton) {
            playButton.textContent = "▶";
        }


        if (progressBar) {
            progressBar.value = 0;
        }


        if (currentTimeDisplay) {
            currentTimeDisplay.textContent = "00:00";
        }


        lyricLines.forEach(function (line) {

            line.classList.remove("active");

        });

    });

}


// ========================================
// FORMAT TIME
// ========================================

function formatTime(seconds) {

    if (
        !Number.isFinite(seconds) ||
        seconds < 0
    ) {

        return "00:00";

    }


    const minutes =
        Math.floor(seconds / 60);


    const secondsLeft =
        Math.floor(seconds % 60);


    return (
        String(minutes).padStart(2, "0")
        + ":"
        + String(secondsLeft).padStart(2, "0")
    );

}


// ========================================
// LYRICS
// ========================================

function updateLyrics(currentTime) {

    if (!lyricLines.length) {
        return;
    }


    let activeIndex = -1;


    for (
        let i = 0;
        i < lyricLines.length;
        i++
    ) {

        const startTime =
            Number(
                lyricLines[i].dataset.time
            );


        if (
            Number.isFinite(startTime) &&
            currentTime >= startTime
        ) {

            activeIndex = i;

        }

    }


    lyricLines.forEach(function (line, index) {

        if (index === activeIndex) {

            line.classList.add("active");

        } else {

            line.classList.remove("active");

        }

    });

}