/*jshint maxlen:120 */
/*jshint -W079 */
var mockData = (function () {
    return {
        getMockCocktails: getMockCocktails
    };

    function getMockCocktails() {
        return [
            {
                "name": "Белый Русский",
                "bar_ingredients": [
                    {
                        "name": "Водка",
                        "amount": 50,
                        "step": 1
                    },
                    {
                        "name": "Калуа",
                        "amount": 30,
                        "step": 2
                    },
                    {
                        "name": "Сливки",
                        "amount": 30,
                        "step": 3
                    }
                ],
                "ingredients": [
                    {
                        "name": "Лед",
                        "amount": "100 гр"
                    }
                ],
                "description": "Назван \"Русским\" в честь основного ингридиента - водка",
                "recipe": [
                    "Наполните бокал кубиками льда",
                    "Поставьте в место для стакана",
                    "Нажмите 'приготовить'",
                    "Аккуратно размешайте"
                ]
            },
            {
                "name": "Мохито",
                "bar_ingredients": [
                    {
                        "name": "Ром Светлый",
                        "amount": 40,
                        "step": 1
                    },
                    {
                        "name": "Содовая",
                        "amount": 100,
                        "step": 2
                    },
                    {
                        "name": "Сок лайма",
                        "amount": 30,
                        "step": 3
                    }
                ],
                "ingredients": [
                    {
                        "name": "Лед",
                        "amount": "100 гр"
                    },
                    {
                        "name": "Сахар",
                        "amount": "2 ложки"
                    },
                    {
                        "name": "Мята",
                        "amount": "10 листьев"
                    }
                ],
                "description": "Один из самых популярных коктейлей на основе рома",
                "recipe": [
                    "Положите в бокал несколько листьев мяты и две чайные ложки сахара",
                    "Подавите мяту",
                    "Наполните бокал дробленым льдом",
                    "Поставьте в место для стакана"
                ]
            }
        ];
    }
})();
