require.config({
  paths: {
    vs: "https://cdn.jsdelivr.net/npm/monaco-editor@0.52.2/min/vs"
  }
});

require(["vs/editor/editor.main"], function () {

  const templates = {

    cpp:
`#include <iostream>
using namespace std;

int main() {

    cout << "Hello CodeLib!";

    return 0;
}`,

    python:
`print("Hello CodeLib!")`,

    pascal:
`program Hello;

begin
    writeln('Hello CodeLib!');
end.`

  };

  const editor = monaco.editor.create(document.getElementById("editor"), {

    value: templates.cpp,

    language: "cpp",

    theme: "vs-dark",

    fontSize: 16,

    automaticLayout: true,

    minimap: {
      enabled: false
    }

  });

  const languageSelect = document.getElementById("languageSelect");

  languageSelect.addEventListener("change", function () {

    const selected = languageSelect.value;

    editor.setValue(templates[selected]);

  });

});