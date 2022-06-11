var searchTerms;
var trackID;
var resultsSection = document.getElementById("results");
var backButton = document.getElementById("back-button-container");

function checkRadio() {
    searchTerms = document.getElementById("search").value;

    if ($("#artistRadioButton").is(":checked")) {
        getArtist();
    }
    else {
        getTrack();
    }
}

function resetPage() {
    resultsSection.innerHTML = "";
    backButton.innerHTML = "";
}

function getTrack() {
    resetPage();
    $.ajax({
            type: "GET",
            data: {
                apikey: "e6920e403abc2af1ec44c18d795e5e21",
                q_track: searchTerms,
                format: "jsonp",
                callback: "jsonp_callback",
                page_size: 100,
                s_artist_rating: "DESC",

            },

            url: "https://api.musixmatch.com/ws/1.1/track.search",
            dataType: "jsonp",
            jsonpCallback: 'jsonp_callback',
            contentType: 'application/json',
            success: function(data) {
                var trackResults = data.message.body.track_list;
                resultsSection.innerHTML += `<thead>
                                                <tr>
                                                  <th scope="col">Track Name</th>
                                                  <th scope="col">Artist</th>
                                                  <th scope="col">Lyrics</th>
                                                </tr>
                                             </thead>`;
                trackResults.forEach(function(item) {
                    resultsSection.innerHTML += `<tbody>
                                                    <tr>
                                                        <td>${item.track.track_name}</td>
                                                        <td>${item.track.artist_name}</td>
                                                        <td>
                                                            <button class="btn btn-secondary btn-result" onclick="returnLyrics(${item.track.track_id}, 'getTrack')">Click here for lyrics</button>
                                                            <button class="btn btn-secondary btn-result-mobile" onclick="returnLyrics(${item.track.track_id}, 'getTrack')">Lyrics</button>
                                                        </td>
                                                    </tr>
                                                </tbody>`;

                });
                if (trackResults.length === 0) {
                    resetPage();
                    resultsSection.innerHTML += `<thead>
                                                    <tr>
                                                        <th scope="col">A problem has occurred!</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    <tr>
                                                        <td>Sorry, no results were found.</td>
                                                    </tr>
                                                </tbody>`;
                }


            },

        }

    );
}

function getArtist() {
    resetPage();
    $.ajax({
            type: "GET",
            data: {
                apikey: "16099f064260947071709a4bc6421891",
                q_artist: searchTerms,
                format: "jsonp",
                callback: "jsonp_callback",
                page_size: 50,
                s_artist_rating: "DESC",

            },

            url: "https://api.musixmatch.com/ws/1.1/artist.search",
            dataType: "jsonp",
            jsonpCallback: 'jsonp_callback',
            contentType: 'application/json',
            success: function(data) {
                var artistResults = data.message.body.artist_list;
                resultsSection.innerHTML += `<thead>
                                                <tr>
                                                  <th scope="col">Artist Name</th>
                                                  <th scope="col">Albums</th>
                                                </tr>
                                             </thead>`;
                artistResults.forEach(function(item) {
                    resultsSection.innerHTML += `<tbody>
                                                        <tr>
                                                        <td>${item.artist.artist_name}</td>
                                                        <td>
                                                            <button class="btn btn-secondary btn-result" onclick="getAlbumList(${item.artist.artist_id})">Click here for list of albums</button>
                                                                <button class="btn btn-secondary btn-result-mobile" onclick="getAlbumList(${item.artist.artist_id})">Albums</button>
                                                        </td>
                                                    </tr>
                                                </tbody>`;

                });
                if (artistResults.length === 0) {
                    resetPage();
                    resultsSection.innerHTML += `<thead>
                                                    <tr>
                                                        <th scope="col">A problem has occurred!</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    <tr>
                                                        <td>Sorry, no results were found.</td>
                                                    </tr>
                                                </tbody>`;
                }

            },

        }

    );
}


function getAlbumList(artistID) {
    window['currentArtist'] = artistID;
    resetPage();
    $.ajax({
            type: "GET",
            data: {
                apikey: "16099f064260947071709a4bc6421891",
                artist_id: artistID,
                format: "jsonp",
                callback: "jsonp_callback",
                page_size: 100,
                g_album_name: 1

            },
            url: "https://api.musixmatch.com/ws/1.1/artist.albums.get",
            dataType: "jsonp",
            jsonpCallback: 'jsonp_callback',
            contentType: 'application/json',
            success: function(data) {
                var albumList = data.message.body.album_list;
                backButton.innerHTML += `<button class="btn btn-secondary btn-srch" onclick="getArtist()"><i class="fas fa-chevron-left"></i> Go Back</button>`;
                resultsSection.innerHTML += `<thead>
                                                <tr>
                                                  <th scope="col">Album Name</th>
                                                  <th scope="col">Track List</th>
                                                </tr>
                                            </thead>`;
                albumList.forEach(function(item) {
                    resultsSection.innerHTML += `<tbody>
                                                    <tr>
                                                        <td>${item.album.album_name}</td>
                                                        <td>
                                                            <button class="btn btn-secondary btn-result" onclick="getTrackList(${item.album.album_id})">Click here for list of tracks</button>
                                                            <button class="btn btn-secondary btn-result-mobile" onclick="getTrackList(${item.album.album_id})">Tracks</button>
                                                        </td>
                                                    </tr>
                                                </tbody>`;
                });
                if (albumList.length === 0) {
                    resetPage();
                    backButton.innerHTML += `<button class="btn btn-secondary btn-srch" onclick="getArtist()"><i class="fas fa-chevron-left"></i> Go Back</button>`;
                    resultsSection.innerHTML += `<thead>
                                                    <tr>
                                                        <th scope="col">A problem has occurred!</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    <tr>
                                                        <td>Sorry, no results were found.</td>
                                                    </tr>
                                                </tbody>`;
                }




            }
        }

    );
}

function getTrackList(albumID) {
    window['currentAlbum'] = albumID;
    resetPage();
    $.ajax({
            type: "GET",
            data: {
                apikey: "16099f064260947071709a4bc6421891",
                album_id: albumID,
                format: "jsonp",
                callback: "jsonp_callback",
                page_size: 50,

            },
            url: "https://api.musixmatch.com/ws/1.1/album.tracks.get",
            dataType: "jsonp",
            jsonpCallback: 'jsonp_callback',
            contentType: 'application/json',
            success: function(data) {
                var trackResults = data.message.body.track_list;
                backButton.innerHTML += '<button class="btn btn-secondary btn-srch" onclick="getAlbumList(' + window['currentArtist'] + ')"><i class="fas fa-chevron-left"></i> Go Back</button>';
                resultsSection.innerHTML += `<thead>
                                                <tr>
                                                  <th scope="col">Track Name</th>
                                                  <th scope="col">Lyrics</th>
                                                </tr>
                                             </thead>`;
                trackResults.forEach(function(item) {
                    resultsSection.innerHTML += `<tbody>
                                                    <tr>
                                                        <td>${item.track.track_name}</td>
                                                        <td>
                                                            <button class="btn btn-secondary btn-result" onclick="returnLyrics(${item.track.track_id}, 'getTrackList')">Click here for lyrics</button>
                                                            <button class="btn btn-secondary btn-result-mobile" onclick="returnLyrics(${item.track.track_id}, 'getTrackList')">Lyrics</button>
                                                        </td>
                                                    </tr>
                                                </tbody>`;
                });
                if (trackResults.length === 0) {
                    resetPage();
                    backButton.innerHTML += '<button class="btn btn-secondary btn-srch" onclick="getAlbumList(' + window['currentArtist'] + ')"><i class="fas fa-chevron-left"></i> Go Back</button>';
                    resultsSection.innerHTML += `<thead>
                                                    <tr>
                                                        <th scope="col">A problem has occurred!</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    <tr>
                                                        <td>Sorry, no results were found.</td>
                                                    </tr>
                                                </tbody>`;
                }

            }
        }

    );
}

function returnLyrics(trackID, goBack) {
    resetPage();
    var trackName;

    function createBackButton() {
        if (goBack == 'getTrack') {
            backButton.innerHTML += '<button class="btn btn-secondary btn-srch" onclick="getTrack()"><i class="fas fa-chevron-left"></i> Go Back</button>';
        }
        else {
            backButton.innerHTML += '<button class="btn btn-secondary btn-srch" onclick="getTrackList(' + window['currentAlbum'] + ')"><i class="fas fa-chevron-left"></i> Go Back</button>';
        }
    }
    createBackButton();
    $.ajax({
        type: "GET",
        data: {
            apikey: "16099f064260947071709a4bc6421891",
            track_id: trackID,
            format: "jsonp",
            callback: "jsonp_callback",

        },
        url: "https://api.musixmatch.com/ws/1.1/track.get",
        dataType: "jsonp",
        jsonpCallback: 'jsonp_callback',
        contentType: 'application/json',
        success: function(data) {
            trackName = data.message.body.track.track_name;
        },
        complete: function() {
            $.ajax({
                type: "GET",
                data: {
                    apikey: "16099f064260947071709a4bc6421891",
                    track_id: trackID,
                    format: "jsonp",
                    callback: "jsonp_callback",

                },
                url: "https://api.musixmatch.com/ws/1.1/matcher.lyrics.get",
                dataType: "jsonp",
                jsonpCallback: 'jsonp_callback',
                contentType: 'application/json',
                success: function(data) {
                    try {
                        var lyricResults = data.message.body.lyrics.lyrics_body;
                        var lyricCopyright = data.message.body.lyrics.lyrics_copyright;
                    }
                    catch (err) {
                        resultsSection.innerHTML += `<thead>
                                                <tr>
                                                  <th scope="col">A problem has occurred!</th>
                                                </tr>
                                             </thead>
                                             <tbody>
                                                <tr>
                                                    <td>Sorry, there are no lyrics available for this song.</td>
                                                </tr>
                                             </tbody>`;
                        return;

                    }

                    resultsSection.innerHTML += `<thead>
                                                <tr>
                                                  <th scope="col">${trackName}</th>
                                                </tr>
                                             </thead>
                                             <tbody>
                                                <tr>
                                                    <td class="lyrics">${lyricResults}<br>${lyricCopyright}</td>
                                                </tr>
                                             </tbody>`;

                    if (lyricResults == "" && lyricCopyright == "") {
                        resetPage();
                        createBackButton();
                        resultsSection.innerHTML += `<thead>
                                                <tr>
                                                  <th scope="col">A problem has occurred!</th>
                                                </tr>
                                             </thead>
                                             <tbody>
                                                <tr>
                                                    <td>Sorry, there are no lyrics available for this song.</td>
                                                </tr>
                                             </tbody>`;
                        return;
                    }
                }
            });
        }
    });
}
