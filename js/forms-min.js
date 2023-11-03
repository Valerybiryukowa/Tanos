$(document).on("af_complete", function(event, response) {
    if (response.success) {
        ym(55879951, "reachGoal", "zayavka");
        $.magnificPopup.close({
            mainClass: "my-mfp-zoom-in",
            removalDelay: 300
        }, 0);
        setTimeout(function() {
            $.magnificPopup.open({
                mainClass: "my-mfp-zoom-in",
                removalDelay: 300,
                items: {
                    src: "#thanks"
                },
                type: "inline"
            }, 0)
        }, 300)
    }
});
