import json

file = open("quran-simple-clean.txt", "r", encoding='utf-8')

lines = file.readlines()
cnt = 0

chars = words = 0
for line in lines:
    ayah = line.split('|')[2].rstrip()
    # print(ayah)
    words += len(ayah.split())
    chars += (len(ayah) - ayah.count(' '))

print(chars, words)

res = []


file = open('quran_ar.json', encoding='utf-8')
quran = json.load(file)

cnt = 0
for idx, surah in enumerate(quran):
    for vidx, verse in enumerate(surah['verses']):
        quran[idx]['verses'][vidx]['text'] = lines[cnt].split('|')[2].rstrip()
        cnt += 1

print(cnt)


# with open('quran-simple.json', 'w', encoding='utf-8') as writer:
#     json.dump(quran, writer, ensure_ascii=False, indent=2)


# for surah in quran:
#     if surah['id'] == 1:
#         # print(surah)
#         for verse in surah['verses']:
#             ayah = verse['text']
#             print(verse['text'], len(verse['text']), len(ayah.split()))
        
#         break

    

# texts = ['بسم الله الرحمن الرحيم','الحمد لله رب العالمين', 'الرحمن الرحيم','مالك يوم الدين','إياك نعبد وإياك نستعين','	اهدنا الصراط المستقيم','صراط الذين أنعمت عليهم غير المغضوب عليهم ولا الضالين']

# for text in texts:
#     print(text)
#     print(len(text), len(text.split()))