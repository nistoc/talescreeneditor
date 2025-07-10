param(
    [Parameter()]
    [string]$Container = "tales-screen-editor-dev",
    
    [Parameter()]
    [switch]$Follow
)

if ($Follow) {
    docker logs -f $Container
} else {
    docker logs $Container
}
