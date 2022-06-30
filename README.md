<p align="center">
    <img src="./public/assets/brandIcon.svg" alt="african adage"/>
</p>

<h1 align="center">African Adage</h1>

The African Adage API
The African Heritage API is a JSON RESTfull API that returns African proverbs, stories, and more

## Adage Endpoints

```
*GET* https://africanheritage.up.railway.app/adage
```

Returns a random adage

```json
{
  "id": 127,
  "adage": "a person cannot abandon his family and walk alone, he must return",
  "uniqueTo": "kenyan",
  "translations": {
    "samburu": "Meeta enilo openy",
    "kiswahili": "Mtu hawezi kuacha jamii yake na kutembea peke yake; lazima arudi",
    "french": "N’abandone pas ta famille et va seule, tu dois retourner"
  },
  "interpretation": "it teaches that family is of great value to society. a person always needs to be part of a family circle. even if you segregate yourself, a time comes when one needsthem. family will support someone, whether they are good or bad. blood is thicker than water. family bonds are very important to everyone"
}
```

```
*GET* https://africanheritage.up.railway.app/adage/aod
```

Returns a cached adage which only changes its value 23rd hours every day.
