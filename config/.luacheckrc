-- .luacheckrc

-- Root project config
std = "lua54+luajit"     -- or "lua54" for modern Lua projects
globals = {
    "vim",               -- For Neovim plugins
    "love",              -- For LÖVE game engine
    "describe", "it", "before_each", "after_each", "setup", "teardown", -- Busted test globals
    "use", "require", "package" -- module-related globals
}

-- Ignore specific warning codes
ignore = {
    "111",  -- Unused argument
    "113",  -- Unused loop variable
    "143",  -- Implicit global (often used intentionally)
    "631",  -- Line contains trailing whitespace
    "611",  -- Line is too long
}

-- Enable caching for faster runs
cache = true

-- Maximum line length
max_line_length = 120

-- Allow inline disable/enable
allow_defined_top = true
allow_defined = true

-- Allow inline directive comments (e.g., -- luacheck: ignore ...)
ignore_inline_comment = false

-- Files/folders to include/exclude
files = {
    "**.lua",
    "!**/vendor/**",
    "!**/node_modules/**",
    "!**/.venv/**"
}
