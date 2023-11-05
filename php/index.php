<?php

if ($_SERVER["REQUEST_METHOD"] == "POST" && isset($_POST["article"])) {
    $article = $_POST["article"];
    $login = "493358_stroyzar";
    $password = "sAVDkrEbqd";

    // Формируем URL для отправки запроса
    $url = "https://api.forum-auto.ru/docs/listgoods.php?article=" . urlencode($article);

    // Создаем контекст для HTTP-авторизации
    $options = [
        "http" => [
            "header" => "Authorization: Basic " . base64_encode("$login:$password"),
        ],
    ];

    // Отправляем GET-запрос и получаем данные в формате JSON
    $response = file_get_contents($url, false, stream_context_create($options));

    // Декодируем JSON-ответ в массив
    $data = json_decode($response, true);

    // Выводим таблицу с данными
    echo "<table border='1'>";
    echo "<tr><th>Наименование</th><th>Артикул</th><th>Цена</th></tr>";
    foreach ($data as $item) {
        echo "<tr>";
        echo "<td>" . $item["name"] . "</td>";
        echo "<td>" . $item["article"] . "</td>";
        echo "<td>" . $item["price"] . "</td>";
        echo "</tr>";
    }
    echo "</table>";
}
?>