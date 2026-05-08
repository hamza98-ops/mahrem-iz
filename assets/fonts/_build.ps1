# Mahrem-İz · Google Fonts → Lokal host build script
# Kaynak CSS'ten latin + latin-ext subsetlerini ayırır,
# woff2 dosyalarını indirir, fonts.css üretir.
# Yeniden üretmek için: pwsh assets/fonts/_build.ps1

$ErrorActionPreference = 'Stop'
Set-Location -Path (Split-Path $MyInvocation.MyCommand.Path)

$source = Get-Content "_google-source.css" -Raw
$wantedSubsets = @('latin', 'latin-ext')
$ua = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"

# Block pattern: /* subset */ @font-face { ... }
$rxBlock = [regex]'(?s)/\*\s*([\w-]+)\s*\*/\s*@font-face\s*\{([^}]+)\}'
$rxFamily = [regex]"font-family:\s*'([^']+)'"
$rxStyle  = [regex]'font-style:\s*(\w+)'
$rxWeight = [regex]'font-weight:\s*(\d+)'
$rxSrc    = [regex]'src:\s*url\(([^)]+)\)'
$rxRange  = [regex]'unicode-range:\s*([^;]+)'

$entries = New-Object System.Collections.ArrayList
foreach ($block in $rxBlock.Matches($source)) {
  $subset = $block.Groups[1].Value
  if ($wantedSubsets -notcontains $subset) { continue }
  $body = $block.Groups[2].Value

  $family = $rxFamily.Match($body).Groups[1].Value
  $style  = $rxStyle.Match($body).Groups[1].Value
  $weight = $rxWeight.Match($body).Groups[1].Value
  $url    = $rxSrc.Match($body).Groups[1].Value
  $rng    = $rxRange.Match($body).Groups[1].Value.Trim()

  $shortFamily = if ($family -eq 'Playfair Display') { 'playfair' } else { 'inter' }
  $localFile = "{0}-{1}-{2}-{3}.woff2" -f $shortFamily, $weight, $style, $subset

  [void]$entries.Add([PSCustomObject]@{
    family = $family
    style  = $style
    weight = [int]$weight
    url    = $url
    range  = $rng
    file   = $localFile
    subset = $subset
  })
}

Write-Output ("Eslesen kayit: " + $entries.Count)

# Download
$i = 0
foreach ($e in $entries) {
  $i++
  if (-not (Test-Path $e.file)) {
    Write-Output ("[{0,2}/{1}] indir: {2}" -f $i, $entries.Count, $e.file)
    Invoke-WebRequest -Uri $e.url -UserAgent $ua -OutFile $e.file -UseBasicParsing
  } else {
    Write-Output ("[{0,2}/{1}] var:   {2}" -f $i, $entries.Count, $e.file)
  }
}

# Build fonts.css
$lines = New-Object System.Collections.ArrayList
[void]$lines.Add('/* ============================================================')
[void]$lines.Add('   Mahrem-Iz · Lokal font tanımları')
[void]$lines.Add('   Inter (OFL) + Playfair Display (OFL) — Google Fonts kaynaklı')
[void]$lines.Add('   Lokal hosting: gizlilik vaadi tutarlılığı (3rd-party istek yok)')
[void]$lines.Add('   Yeniden üretmek için: pwsh assets/fonts/_build.ps1')
[void]$lines.Add('   ============================================================ */')
[void]$lines.Add('')
foreach ($e in $entries | Sort-Object family, weight, style, subset) {
  [void]$lines.Add(("/* {0} · {1} {2} · {3} */" -f $e.family, $e.weight, $e.style, $e.subset))
  [void]$lines.Add('@font-face {')
  [void]$lines.Add(("  font-family: '{0}';" -f $e.family))
  [void]$lines.Add(("  font-style: {0};" -f $e.style))
  [void]$lines.Add(("  font-weight: {0};" -f $e.weight))
  [void]$lines.Add('  font-display: swap;')
  [void]$lines.Add(("  src: url('{0}') format('woff2');" -f $e.file))
  [void]$lines.Add(("  unicode-range: {0};" -f $e.range))
  [void]$lines.Add('}')
  [void]$lines.Add('')
}
$lines -join "`n" | Out-File -Encoding utf8 -FilePath "fonts.css"

# Summary
Write-Output ""
Write-Output ("fonts.css yazildi: " + (Get-Item fonts.css).Length + " bytes")
$totalSize = (Get-ChildItem -Filter *.woff2 | Measure-Object -Property Length -Sum).Sum
Write-Output ("Toplam woff2: {0} dosya, {1:N1} KB" -f (Get-ChildItem -Filter *.woff2).Count, ($totalSize / 1KB))
$entries | Group-Object family | ForEach-Object { Write-Output ("  - {0}: {1} varyant" -f $_.Name, $_.Count) }
