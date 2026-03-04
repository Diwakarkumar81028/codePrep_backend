function getLanguageId(lang){
    const language={
        "c++":54,
        "javascript":63,
        "java":62
    }
    return language[lang.toLowerCase()];
}

export default getLanguageId