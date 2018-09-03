class MarkdownUtility{
    constructor(){
        const _regexLink = new RegExp("\[(.*?)\]\(.*?\)");
        const _regexMarkupChar = new RegExp("[*#>`-]");
        const _regexMultiSpace = new RegExp(" {2,}");
    }
    ConvertToPlainText(markdown){
        return this._regexMultiSpace.replace(
            this._regexMarkupChar.replace(
                this._regexLink.replace(markdown, " \"$1\" "), " "
            ), " "
        )
    }
}