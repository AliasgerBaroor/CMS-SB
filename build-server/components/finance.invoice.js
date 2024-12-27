const fs = require("fs/promises");
const path = require("path");

const InvoiceTemplate = async (_sourceCodePath) => {
    const ComponentPath = path.join(_sourceCodePath, "src", "app", "component");
    const Filename = "invoice";
    const FileDirectory = path.join(ComponentPath, Filename);
    const FilePath = path.join(FileDirectory, `${Filename}.tsx`);

    try {
        await fs.access(ComponentPath);
        console.log("Path exists:", ComponentPath);
    } catch (err) {
        await fs.mkdir(ComponentPath, { recursive: true });
        console.log("Path created:", ComponentPath);
    }

    try {
        await fs.access(FileDirectory);
        console.log("Directory exists:", FileDirectory);
    } catch (err) {
        await fs.mkdir(FileDirectory, { recursive: true });
        console.log("Directory created:", FileDirectory);
    }

    try {
        await fs.access(FilePath);
        console.log("File exists:", FilePath);
    } catch (err) {
        await fs.writeFile(FilePath, "");
        console.log("File created:", FilePath);
    }
};

InvoiceTemplate("D:\\projects\\remix\\CMS-Wrapper\\build-server\\builds\\nanoFind")
    .then(() => console.log("Execution completed"))
    .catch((error) => console.error("Error:", error));

module.exports = InvoiceTemplate;
