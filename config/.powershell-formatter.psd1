@{
    # PowerShell Beautifier Formatting Configuration
    UseSettingsFile = $true

    PipelineIndentation = 'IncreaseIndentationAfterEachPipeline'  # or 'NoIndentation'
    OpenBraceOnSameLine = $true
    NewLineAfterOpenBrace = $true
    NewLineBeforeCloseBrace = $true
    WhitespaceAroundOperator = $true
    PlaceCloseBraceOnNewLine = $true
    UseConstantStrings = $true
    TrimWhitespace = $true
    ConvertToUsingImplicitReturn = $true
    ConvertDoubleQuotesToSingle = $true
    ConvertToConsistentCommentStyle = $true

    IndentationSize = 4
    IndentationType = 'space'  # or 'tab'

    MaxLineLength = 120
    AlignPropertyAssignment = $true
    PreserveIndentationInHereStrings = $true

    # Optional: enable formatting for all tokens including comments, pipeline alignment, etc.
    EnableAdvancedFeatures = $true
}
