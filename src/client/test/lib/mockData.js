/*jshint maxlen:120 */
/*jshint -W079 */
var mockData = (function () {
    return {
        getMockCocktails: getMockCocktails
    };

    function getMockCocktails() {
        return [
            {
                "name": "����� �������",
                "bar_ingredients": [
                    {
                        "name": "�����",
                        "amount": 50,
                        "step": 1
                    },
                    {
                        "name": "�����",
                        "amount": 30,
                        "step": 2
                    },
                    {
                        "name": "������",
                        "amount": 30,
                        "step": 3
                    }
                ],
                "ingredients": [
                    {
                        "name": "���",
                        "amount": "100 ��"
                    }
                ],
                "description": "������ \"�������\" � ����� ��������� ����������� - �����",
                "recipe": [
                    "��������� ����� �������� ����",
                    "��������� � ����� ��� �������",
                    "������� '�����������'",
                    "��������� ����������"
                ]
            },
            {
                "name": "������",
                "bar_ingredients": [
                    {
                        "name": "��� �������",
                        "amount": 40,
                        "step": 1
                    },
                    {
                        "name": "�������",
                        "amount": 100,
                        "step": 2
                    },
                    {
                        "name": "��� �����",
                        "amount": 30,
                        "step": 3
                    }
                ],
                "ingredients": [
                    {
                        "name": "���",
                        "amount": "100 ��"
                    },
                    {
                        "name": "�����",
                        "amount": "2 �����"
                    },
                    {
                        "name": "����",
                        "amount": "10 �������"
                    }
                ],
                "description": "���� �� ����� ���������� ��������� �� ������ ����",
                "recipe": [
                    "�������� � ����� ��������� ������� ���� � ��� ������ ����� ������",
                    "�������� ����",
                    "��������� ����� ��������� �����",
                    "��������� � ����� ��� �������"
                ]
            }
        ];
    }
})();
