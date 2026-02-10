@{
    # Required module version for compatibility
    RootModule = 'PSScriptAnalyzer'

    # Compatibility settings
    PowerShellVersion = '5.1'

    # Rules to include
    IncludeRules = @(
        'PSAvoidUsingWriteHost',
        'PSAvoidUsingInvokeExpression',
        'PSAvoidGlobalVars',
        'PSUseApprovedVerbs',
        'PSAvoidUsingConvertToSecureStringWithPlainText',
        'PSAvoidUsingEmptyCatchBlock',
        'PSUseConsistentIndentation',
        'PSUseConsistentWhitespace',
        'PSAvoidUsingPositionalParameters',
        'PSAvoidUsingPlainTextForPassword',
        'PSAvoidLongLines',
        'PSAvoidMultipleTypesWithSameName'
    )

    # Rules to exclude
    ExcludeRules = @(
        'PSAvoidUsingWriteDebug',   # okay in dev tools
        'PSUseShouldProcessForStateChangingFunctions' # often not relevant in scripts
    )

    # Severity overrides (optional)
    Severity = @{
        PSUseApprovedVerbs = 'Warning'
        PSAvoidGlobalVars = 'Error'
        PSAvoidUsingInvokeExpression = 'Error'
    }

    # Custom settings (optional)
    Rules = @{
        PSUseConsistentIndentation = @{
            Enable = $true
            IndentationSize = 4
            Kind = 'space'
        }
        PSUseConsistentWhitespace = @{
            Enable = $true
        }
    }
}
