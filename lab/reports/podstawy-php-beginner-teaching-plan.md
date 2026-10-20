# Teaching Plan — Podstawy PHP dla początkujących

Date: 2026-10-19

## Target persona

Self-directed beginner using Windows and VS Code who has never written or run PHP
on their own computer.

## KNOWS

- can open VS Code;
- can create a folder and save a file;
- can follow a short sequence of instructions.

## DOES_NOT_KNOW

- whether PHP is installed or what actually executes PHP source code;
- whether a VS Code extension is required;
- how the editor, file, terminal and PHP CLI relate to one another;
- how to save, run, edit and rerun a program;
- how to distinguish source code, normal output and an error message;
- what `<?php`, `echo`, `$`, `=`, `;` and `\n` do.

## LEARNING_GOAL

The learner can verify PHP CLI, create `start.php`, write and save a small program,
run it from the correct folder, modify it, predict and inspect its output, correct
a simple syntax error and combine values, variables and arithmetic in a small
calculation.

## PREREQUISITES

- a computer with VS Code or another plain-text code editor;
- PHP CLI installed and available through `php`, or willingness to follow the
  linked general installation guidance before continuing;
- no web server, browser integration, database, Composer, Xdebug or mandatory VS
  Code extension.

## Mental model

```text
source file → PHP CLI interpreter → output or diagnostic in the terminal
```

VS Code edits the source file. PHP executes it. An extension may improve editing,
but it does not replace the PHP interpreter.

## Likely confusions

- `start.php.txt` instead of `start.php`;
- terminal opened in a different folder;
- running an older saved version after forgetting `Ctrl+S`;
- treating `=` as a comparison rather than assignment;
- assuming a VS Code extension installs or runs PHP;
- expecting a browser, Apache or XAMPP control panel to be required for CLI work;
- reading an error as failure rather than information about where to look.

## Knowledge around the corner

Conditions use boolean values to choose a path. Arrays group several values.
Functions name reusable operations. These topics are named at the end but are not
taught in this article.

